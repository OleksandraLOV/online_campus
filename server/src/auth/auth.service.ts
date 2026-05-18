import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
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
  private readonly accessTokenExpiresIn: NonNullable<
    JwtSignOptions['expiresIn']
  >;
  private readonly refreshTokenExpiresIn: NonNullable<
    JwtSignOptions['expiresIn']
  >;

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly auditLogService: AuditLogService,
    configService: ConfigService,
  ) {
    this.accessTokenExpiresIn =
      configService.get<NonNullable<JwtSignOptions['expiresIn']>>(
        'JWT_EXPIRES_IN',
      ) ?? '15m';
    this.refreshTokenExpiresIn =
      configService.get<NonNullable<JwtSignOptions['expiresIn']>>(
        'JWT_REFRESH_EXPIRES_IN',
      ) ?? '7d';
  }

  async login(
    login: string,
    pass: string,
    ipAddress = 'unknown',
    userAgent = 'unknown',
    requestId?: string,
  ) {
    const user = (await this.usersService.findByLogin(
      login,
    )) as unknown as AuthUser | null;

    if (!user) {
      this.auditLogService.logAction({
        userId: null,
        userLogin: login,
        action: 'auth.login',
        ipAddress,
        userAgent,
        result: 'failure',
        details: { reason: 'Invalid credentials' },
        requestId,
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
        requestId,
      });
      throw new ForbiddenException('Обліковий запис заблоковано');
    }

    if (!(await bcrypt.compare(pass, user.passwordHash))) {
      this.auditLogService.logAction({
        userId: user.id,
        userLogin: login,
        action: 'auth.login',
        ipAddress,
        userAgent,
        result: 'failure',
        details: { reason: 'Invalid credentials' },
        requestId,
      });
      throw new UnauthorizedException('Невірний логін або пароль');
    }

    const payload: ValidJwtPayload = {
      sub: user.id,
      login: user.login,
      role: user.role,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.accessTokenExpiresIn,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.refreshTokenExpiresIn,
    });

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
      requestId,
    });

    const userObj = user.toObject();
    const safeUser: Record<string, unknown> = { ...userObj };

    Reflect.deleteProperty(safeUser, 'passwordHash');
    Reflect.deleteProperty(safeUser, 'refreshTokenHashes');

    return { accessToken, refreshToken, user: safeUser };
  }

  async getProfile(userId: string) {
    const userDto = await this.usersService.findOne(userId);
    if (!userDto) throw new UnauthorizedException('Користувача не знайдено');
    return userDto;
  }

  async refresh(
    refreshToken: string,
    ipAddress = 'unknown',
    userAgent = 'unknown',
    requestId?: string,
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
        requestId,
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
        requestId,
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
        requestId,
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
        requestId,
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
        requestId,
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
      expiresIn: this.accessTokenExpiresIn,
    });
    const newRefreshToken = this.jwtService.sign(newPayload, {
      expiresIn: this.refreshTokenExpiresIn,
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
      requestId,
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  async logout(
    refreshToken: string,
    ipAddress = 'unknown',
    userAgent = 'unknown',
    requestId?: string,
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
        requestId,
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
        requestId,
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
        requestId,
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
        requestId,
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
      requestId,
    });

    return { message: 'Logged out' };
  }

  async changePassword(
    userId: string,
    dto: ChangePasswordDto,
    ipAddress: string,
    userAgent: string,
    requestId?: string,
  ) {
    const user = (await this.usersService.findByIdWithPassword(
      userId,
    )) as unknown as AuthUser | null;

    if (!user) throw new UnauthorizedException('Користувача не знайдено');

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
        requestId,
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
      requestId,
    });

    return { message: 'Пароль успішно змінено' };
  }
}
