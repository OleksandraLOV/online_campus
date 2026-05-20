import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { Role } from '../common/types/roles.enum';
import { PaginatedDto } from '../common/dto/paginated.dto';
import { ApiPaginatedResponse } from '../common/swagger/api-paginated.response';
import { AuditLogService } from './audit-log.service';
import { AuditLogEntryDto, AuditLogQueryDto } from './dto';

@ApiTags('audit-log')
@ApiBearerAuth()
@Controller('audit-log')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'List audit log entries for administrators' })
  @ApiPaginatedResponse(AuditLogEntryDto)
  @ApiResponse({ status: 403, description: 'Admin role required' })
  findAll(
    @Query() query: AuditLogQueryDto,
  ): Promise<PaginatedDto<AuditLogEntryDto>> {
    return this.auditLogService.findAll(query);
  }
}
