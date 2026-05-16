import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from './schemas/audit-log.schema';

describe('AuditLogService', () => {
  let service: AuditLogService;
  const auditModel = {
    create: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogService,
        {
          provide: getModelToken(AuditLog.name),
          useValue: auditModel,
        },
      ],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should persist audit entries asynchronously', async () => {
    service.logAction({
      userId: null,
      userLogin: 'Guest',
      action: 'POST /auth/login',
      ipAddress: '127.0.0.1',
      userAgent: 'jest',
      result: 'failure',
      requestId: 'req-1',
    });

    await Promise.resolve();

    expect(auditModel.create).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'POST /auth/login',
        ipAddress: '127.0.0.1',
        result: 'failure',
        requestId: 'req-1',
      }),
    );
  });
});
