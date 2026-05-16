import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AuditLogService } from './audit-log.service';
import { RequestWithId } from '../common/middleware/request-id.middleware';

interface JwtUser {
  sub: string;
  login: string;
}

interface AuthenticatedRequest extends RequestWithId {
  user?: JwtUser;
}

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = request.user;

    const ip = request.ip || request.socket?.remoteAddress || 'unknown';
    const userAgent = request.get('user-agent') || 'unknown';
    const method = request.method;
    const url = request.url;
    const action = `${method} ${url}`;
    const requestId = request.requestId;

    return next.handle().pipe(
      tap(() => {
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          this.auditLogService.logAction({
            userId: user?.sub || null,
            userLogin: user?.login || 'Guest',
            action,
            ipAddress: ip,
            userAgent,
            result: 'success',
            requestId,
          });
        }
      }),
      catchError((error: unknown) => {
        if (
          ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method) ||
          url.includes('/login')
        ) {
          this.auditLogService.logAction({
            userId: user?.sub || null,
            userLogin: user?.login || 'Guest',
            action,
            ipAddress: ip,
            userAgent,
            result: 'failure',
            requestId,
          });
        }
        throw error;
      }),
    );
  }
}
