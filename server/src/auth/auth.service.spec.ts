import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { createHash } from 'crypto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { UsersService } from '../users/users.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthService } from './auth.service';

type MockUser = {
  id: string;
  login: string;
  role: string;
  status: string;
  passwordHash: string;
  refreshTokenHashes: string[];
  toObject: () => Record<string, unknown>;
};

const tokenHash = (token: string) =>
  createHash('sha256').update(token).digest('hex');

const createUser = (overrides: Partial<MockUser> = {}): MockUser => {
  const user = {
    id: '6622b2a00f3a22d5b625d171',
    login: 'admin',
    role: 'admin',
    status: 'active',
    passwordHash: bcrypt.hashSync('password123', 4),
    refreshTokenHashes: [],
    ...overrides,
  } satisfies Omit<MockUser, 'toObject'>;

  return {
    ...user,
    toObject: () => ({
      _id: user.id,
      id: user.id,
      login: user.login,
      role: user.role,
      status: user.status,
      passwordHash: user.passwordHash,
      refreshTokenHashes: user.refreshTokenHashes,
    }),
  };
};

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: jest.Mocked<Pick<JwtService, 'sign' | 'verify'>>;
  let usersService: jest.Mocked<
    Pick<
      UsersService,
      | 'findByLogin'
      | 'findByIdWithPassword'
      | 'addRefreshTokenHash'
      | 'removeRefreshTokenHash'
      | 'removeAllRefreshTokenHashes'
      | 'updatePassword'
      | 'findOne'
    >
  >;
  let auditLogService: jest.Mocked<Pick<AuditLogService, 'logAction'>>;

  beforeEach(() => {
    jwtService = {
      sign: jest.fn(),
      verify: jest.fn(),
    };
    usersService = {
      findByLogin: jest.fn(),
      findByIdWithPassword: jest.fn(),
      addRefreshTokenHash: jest.fn(),
      removeRefreshTokenHash: jest.fn(),
      removeAllRefreshTokenHashes: jest.fn(),
      updatePassword: jest.fn(),
      findOne: jest.fn(),
    };
    auditLogService = {
      logAction: jest.fn(),
    };

    const configService = {
      get: jest.fn((key: string) => {
        if (key === 'JWT_EXPIRES_IN') return '15m';
        if (key === 'JWT_REFRESH_EXPIRES_IN') return '7d';
        return undefined;
      }),
    } as unknown as ConfigService;

    service = new AuthService(
      jwtService as unknown as JwtService,
      usersService as unknown as UsersService,
      auditLogService as unknown as AuditLogService,
      configService,
    );
  });

  it('rejects blocked users before password comparison', async () => {
    const blockedUser = createUser({ status: 'blocked' });
    usersService.findByLogin.mockResolvedValue(blockedUser as never);
    const compareSpy = jest.spyOn(bcrypt, 'compare');

    await expect(
      service.login('admin', 'wrong-password', '127.0.0.1', 'jest', 'req-1'),
    ).rejects.toBeInstanceOf(ForbiddenException);

    expect(compareSpy).not.toHaveBeenCalled();
    expect(auditLogService.logAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'auth.login',
        result: 'failure',
        details: { reason: 'Account is blocked' },
      }),
    );

    compareSpy.mockRestore();
  });

  it('stores only refresh token hashes and strips sensitive fields on login', async () => {
    const user = createUser();
    usersService.findByLogin.mockResolvedValue(user as never);
    jwtService.sign
      .mockReturnValueOnce('access-token')
      .mockReturnValueOnce('refresh-token');

    const result = await service.login(
      'admin',
      'password123',
      '127.0.0.1',
      'jest',
      'req-2',
    );

    expect(usersService.addRefreshTokenHash).toHaveBeenCalledWith(
      user.id,
      tokenHash('refresh-token'),
    );
    expect(result).toEqual(
      expect.objectContaining({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      }),
    );
    expect(result.user).not.toHaveProperty('passwordHash');
    expect(result.user).not.toHaveProperty('refreshTokenHashes');
  });

  it('rotates refresh tokens and rejects revoked tokens', async () => {
    const user = createUser({
      refreshTokenHashes: [tokenHash('old-refresh-token')],
    });
    jwtService.verify.mockReturnValue({
      sub: user.id,
      login: user.login,
      role: user.role,
    });
    usersService.findByIdWithPassword.mockResolvedValue(user as never);
    jwtService.sign
      .mockReturnValueOnce('new-access-token')
      .mockReturnValueOnce('new-refresh-token');

    await expect(
      service.refresh('old-refresh-token', '127.0.0.1', 'jest', 'req-3'),
    ).resolves.toEqual({
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
    });

    expect(usersService.removeRefreshTokenHash).toHaveBeenCalledWith(
      user.id,
      tokenHash('old-refresh-token'),
    );
    expect(usersService.addRefreshTokenHash).toHaveBeenCalledWith(
      user.id,
      tokenHash('new-refresh-token'),
    );

    usersService.findByIdWithPassword.mockResolvedValue(
      createUser({ refreshTokenHashes: [] }) as never,
    );

    await expect(
      service.refresh('old-refresh-token', '127.0.0.1', 'jest', 'req-4'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('revokes all refresh sessions after password change', async () => {
    const user = createUser();
    usersService.findByIdWithPassword.mockResolvedValue(user as never);

    const dto: ChangePasswordDto = {
      oldPassword: 'password123',
      newPassword: 'Password123!',
    };

    await expect(
      service.changePassword(user.id, dto, '127.0.0.1', 'jest', 'req-5'),
    ).resolves.toEqual({ message: 'Пароль успішно змінено' });

    expect(usersService.updatePassword).toHaveBeenCalledWith(
      user.id,
      expect.any(String),
    );
    expect(usersService.removeAllRefreshTokenHashes).toHaveBeenCalledWith(
      user.id,
    );
  });
});
