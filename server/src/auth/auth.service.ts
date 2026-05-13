import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash } from 'crypto';
import { UsersService } from '../users/users.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ChangePasswordDto } from './dto/change-password.dto';

interface AuthUser {
  id: string;
  login: string;
  role: string;
  status: string;
  passwordHash: string;
  refreshTokenHashes?: string[];
  toObject: () => Record<string, unknown>;
}

interface ValidJwtPayload {
  sub: string;
  login: string;
  role: string;
}

function isJwtPayload(obj: unknown): obj is ValidJwtPayload {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'sub' in obj &&
    'login' in obj &&
    'role' in obj &&
    typeof (obj as Record<string, unknown>).sub === 'string' &&
    typeof (obj as Record<string, unknown>).login === 'string' &&
    typeof (obj as Record<string, unknown>).role === 'string'
  );
}

function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function getJwtVerifyFailureReason(err: unknown): string {
  if (err && typeof err === 'object') {
    const name = (err as { name?: unknown }).name;
    if (name === 'TokenExpiredError') return 'Refresh token expired';
    if (name === 'JsonWebTokenError') return 'Invalid refresh token';
    if (name === 'NotBeforeError') return 'Refresh token not active';
  }
  return 'Invalid refresh token';
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async login(
    login: string,
    pass: string,
    ipAddress: string = 'unknown',
    userAgent: string = 'unknown',
  ) {
    const user = (await this.usersService.findByLogin(
      login,
    )) as unknown as AuthUser | null;

    if (!user || !(await bcrypt.compare(pass, user.passwordHash))) {
      this.auditLogService.logAction({
        userId: user?.id || null,
        userLogin: login,
        action: 'auth.login',
        ipAddress,
        userAgent,
        result: 'failure',
        details: { reason: 'Invalid credentials' },
      });
      throw new UnauthorizedException('Невірний логін або пароль');
    }

    if (user.status === 'blocked') {
      this.auditLogService.logAction({
        userId: user.id,
        userLogin: login,
        action: 'auth.login',
        ipAddress,
        userAgent,
        result: 'failure',
        details: { reason: 'Account is blocked' },
      });
      throw new ForbiddenException('Обліковий запис заблоковано');
    }

    const payload: ValidJwtPayload = {
      sub: user.id,
      login: user.login,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    await this.usersService.addRefreshTokenHash(
      user.id,
      hashToken(refreshToken),
    );

    this.auditLogService.logAction({
      userId: user.id,
      userLogin: user.login,
      action: 'auth.login',
      ipAddress,
      userAgent,
      result: 'success',
    });

    const userObj = user.toObject();
    const safeUser: Record<string, unknown> = { ...userObj };

    Reflect.deleteProperty(safeUser, 'passwordHash');
    Reflect.deleteProperty(safeUser, 'refreshTokenHashes');

    return {
      accessToken,
      refreshToken,
      user: safeUser,
    };
  }

  async getProfile(userId: string) {
    const userDto = await this.usersService.findOne(userId);
    if (!userDto) {
      throw new UnauthorizedException('Користувача не знайдено');
    }
    return userDto;
  }

  async refresh(
    refreshToken: string,
    ipAddress = 'unknown',
    userAgent = 'unknown',
  ) {
    let decoded: unknown;

    try {
      decoded = this.jwtService.verify(refreshToken);
    } catch (err: unknown) {
      this.auditLogService.logAction({
        userId: null,
        userLogin: 'unknown',
        action: 'auth.refresh',
        ipAddress,
        userAgent,
        result: 'failure',
        details: { reason: getJwtVerifyFailureReason(err) },
      });
      throw new UnauthorizedException('Невірний refresh token');
    }

    if (!isJwtPayload(decoded)) {
      this.auditLogService.logAction({
        userId: null,
        userLogin: 'unknown',
        action: 'auth.refresh',
        ipAddress,
        userAgent,
        result: 'failure',
        details: { reason: 'Invalid refresh token payload' },
      });
      throw new UnauthorizedException('Невірний refresh token');
    }

    const user = (await this.usersService.findByIdWithPassword(
      decoded.sub,
    )) as unknown as AuthUser | null;

    if (!user) {
      this.auditLogService.logAction({
        userId: null,
        userLogin: decoded.login,
        action: 'auth.refresh',
        ipAddress,
        userAgent,
        result: 'failure',
        details: { reason: 'User not found' },
      });
      throw new UnauthorizedException('Користувача не знайдено');
    }

    if (user.status === 'blocked') {
      this.auditLogService.logAction({
        userId: user.id,
        userLogin: user.login,
        action: 'auth.refresh',
        ipAddress,
        userAgent,
        result: 'failure',
        details: { reason: 'Account is blocked' },
      });
      throw new ForbiddenException('Обліковий запис заблоковано');
    }

    const tokenHash = hashToken(refreshToken);
    const hashes = Array.isArray(user.refreshTokenHashes)
      ? user.refreshTokenHashes
      : [];

    if (!hashes.includes(tokenHash)) {
      this.auditLogService.logAction({
        userId: user.id,
        userLogin: user.login,
        action: 'auth.refresh',
        ipAddress,
        userAgent,
        result: 'failure',
        details: { reason: 'Refresh token revoked or unknown' },
      });
      throw new UnauthorizedException('Невірний refresh token');
    }

    await this.usersService.removeRefreshTokenHash(user.id, tokenHash);

    const newPayload: ValidJwtPayload = {
      sub: user.id,
      login: user.login,
      role: user.role,
    };

    const newAccessToken = this.jwtService.sign(newPayload, {
      expiresIn: '15m',
    });
    const newRefreshToken = this.jwtService.sign(newPayload, {
      expiresIn: '7d',
    });

    await this.usersService.addRefreshTokenHash(
      user.id,
      hashToken(newRefreshToken),
    );

    this.auditLogService.logAction({
      userId: user.id,
      userLogin: user.login,
      action: 'auth.refresh',
      ipAddress,
      userAgent,
      result: 'success',
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async logout(
    refreshToken: string,
    ipAddress = 'unknown',
    userAgent = 'unknown',
  ) {
    let decoded: unknown;

    try {
      decoded = this.jwtService.verify(refreshToken);
    } catch (err: unknown) {
      this.auditLogService.logAction({
        userId: null,
        userLogin: 'unknown',
        action: 'auth.logout',
        ipAddress,
        userAgent,
        result: 'failure',
        details: { reason: getJwtVerifyFailureReason(err) },
      });
      throw new UnauthorizedException('Невірний refresh token');
    }

    if (!isJwtPayload(decoded)) {
      this.auditLogService.logAction({
        userId: null,
        userLogin: 'unknown',
        action: 'auth.logout',
        ipAddress,
        userAgent,
        result: 'failure',
        details: { reason: 'Invalid refresh token payload' },
      });
      throw new UnauthorizedException('Невірний refresh token');
    }

    const user = (await this.usersService.findByIdWithPassword(
      decoded.sub,
    )) as unknown as AuthUser | null;

    if (!user) {
      this.auditLogService.logAction({
        userId: null,
        userLogin: decoded.login,
        action: 'auth.logout',
        ipAddress,
        userAgent,
        result: 'failure',
        details: { reason: 'User not found' },
      });
      throw new UnauthorizedException('Користувача не знайдено');
    }

    if (user.status === 'blocked') {
      this.auditLogService.logAction({
        userId: user.id,
        userLogin: user.login,
        action: 'auth.logout',
        ipAddress,
        userAgent,
        result: 'failure',
        details: { reason: 'Account is blocked' },
      });
      throw new ForbiddenException('Обліковий запис заблоковано');
    }

    await this.usersService.removeRefreshTokenHash(
      user.id,
      hashToken(refreshToken),
    );

    this.auditLogService.logAction({
      userId: user.id,
      userLogin: user.login,
      action: 'auth.logout',
      ipAddress,
      userAgent,
      result: 'success',
    });

    return { message: 'Logged out' };
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
    ipAddress: string,
    userAgent: string,
  ) {
    const user = (await this.usersService.findByIdWithPassword(
      userId,
    )) as unknown as AuthUser | null;

    if (!user) {
      throw new UnauthorizedException('Користувача не знайдено');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.oldPassword,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      this.auditLogService.logAction({
        userId: user.id,
        userLogin: user.login,
        action: 'auth.change_password',
        ipAddress,
        userAgent,
        result: 'failure',
        details: { reason: 'Invalid old password' },
      });
      throw new BadRequestException('Невірний старий пароль');
    }

    const newPasswordHash = await bcrypt.hash(dto.newPassword, 12);
    await this.usersService.updatePassword(userId, newPasswordHash);

    await this.usersService.removeAllRefreshTokenHashes(user.id);

    this.auditLogService.logAction({
      userId: user.id,
      userLogin: user.login,
      action: 'auth.change_password',
      ipAddress,
      userAgent,
      result: 'success',
    });

    return { message: 'Пароль успішно змінено' };
  }
}
