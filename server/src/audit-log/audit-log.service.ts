import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuditLog, AuditLogDocument } from './schemas/audit-log.schema';

export interface AuditLogEntry {
  id?: string;
  timestamp?: Date;
  userId: string | null;
  userLogin: string;
  userRole?: string;
  action: string;
  targetEntity?: string;
  targetId?: string;
  details?: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  result: 'success' | 'failure';
  requestId?: string;
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectModel(AuditLog.name)
    private readonly auditModel: Model<AuditLogDocument>,
  ) {}

  // Логування в консоль
  logAction(entry: AuditLogEntry): void {
    const logMessage = `[AUDIT] [ReqID: ${entry.requestId || '-'}] Action: ${entry.action} | User: ${
      entry.userLogin || 'Guest'
    } | IP: ${entry.ipAddress} | Result: ${entry.result}`;

    if (entry.result === 'success') {
      this.logger.log(logMessage);
    } else {
      this.logger.error(logMessage);
    }

    // Асинхронне збереження в БД
    void this.auditModel
      .create({
        timestamp: entry.timestamp ?? new Date(),
        userId: entry.userId,
        userLogin: entry.userLogin || 'unknown',
        userRole: entry.userRole,
        action: entry.action,
        targetEntity: entry.targetEntity,
        targetId: entry.targetId,
        details: entry.details,
        ipAddress: entry.ipAddress,
        userAgent: entry.userAgent,
        result: entry.result,
        requestId: entry.requestId,
      })
      .catch((err: unknown) => {
        this.logger.error(
          '[AUDIT] Failed to persist audit log to DB',
          err as object,
        );
      });
  }
}
