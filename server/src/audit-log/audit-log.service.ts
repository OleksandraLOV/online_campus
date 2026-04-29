import { Injectable, Logger } from '@nestjs/common';

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
}

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  // Phase 1 - логування в консоль/файл
  // Phase 2 - збереження даних в MongoDB через Prisma
  logAction(entry: AuditLogEntry): void {
    const logMessage = `[AUDIT] Action: ${entry.action} | User: ${entry.userLogin || 'Guest'} | IP: ${entry.ipAddress} | Result: ${entry.result}`;

    if (entry.result === 'success') {
      this.logger.log(logMessage, entry);
    } else {
      this.logger.error(logMessage, entry);
    }
  }
}
