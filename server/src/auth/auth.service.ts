import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { ChangePasswordDto } from './dto/change-password.dto';

interface AuthUser {
  id: string;
  login: string;
  role: string;
  status: string;
  passwordHash: string;
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

    this.auditLogService.logAction({
      userId: user.id,
      userLogin: user.login,
      action: 'auth.login',
      ipAddress,
      userAgent,
      result: 'success',
    });

    const payload = { sub: user.id, login: user.login, role: user.role };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    const userObj = user.toObject();
    delete userObj.passwordHash;

    return {
      accessToken,
      refreshToken,
      user: userObj,
    };
  }

  async getProfile(userId: string) {
    const userDto = await this.usersService.findOne(userId);
    if (!userDto) {
      throw new UnauthorizedException('Користувача не знайдено');
    }
    return userDto;
  }

  refresh(refreshToken: string) {
    try {
      const decoded: unknown = this.jwtService.verify(refreshToken);

      if (!isJwtPayload(decoded)) {
        throw new Error('Invalid token');
      }

      const newPayload: ValidJwtPayload = {
        sub: decoded.sub,
        login: decoded.login,
        role: decoded.role,
      };

      return {
        accessToken: this.jwtService.sign(newPayload),
        refreshToken: this.jwtService.sign(newPayload, { expiresIn: '7d' }),
      };
    } catch {
      throw new UnauthorizedException('Невірний refresh token');
    }
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
