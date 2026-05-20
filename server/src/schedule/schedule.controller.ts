import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { AuthenticatedRequest } from '../common/types/authenticated-request';
import { Role } from '../common/types/roles.enum';
import {
  CreateScheduleEntryDto,
  ScheduleEntryDto,
  ScheduleQueryDto,
  UpdateScheduleEntryDto,
} from './dto';
import { ScheduleService } from './schedule.service';

@ApiTags('schedule')
@ApiBearerAuth()
@Controller('schedule')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @ApiOperation({ summary: 'List schedule entries visible to current user' })
  @ApiResponse({ status: 200, type: [ScheduleEntryDto] })
  findAll(
    @Query() query: ScheduleQueryDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.scheduleService.findForUser(req.user, query);
  }

  @Get('my')
  @ApiOperation({ summary: 'List current user schedule entries' })
  @ApiResponse({ status: 200, type: [ScheduleEntryDto] })
  findMy(
    @Query() query: ScheduleQueryDto,
    @Request() req: AuthenticatedRequest,
  ) {
    return this.scheduleService.findForUser(req.user, query);
  }

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @ApiOperation({ summary: 'Export schedule entries as CSV' })
  async exportCsv(
    @Query() query: ScheduleQueryDto,
    @Request() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const csv = await this.scheduleService.exportCsv(req.user, query);
    res.setHeader('Content-Disposition', 'attachment; filename="schedule.csv"');
    return csv;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get schedule entry by id' })
  @ApiResponse({ status: 200, type: ScheduleEntryDto })
  findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.scheduleService.findOneForUser(id, req.user);
  }

  @Post()
  @Roles(Role.DISPATCHER, Role.ADMIN)
  @ApiOperation({ summary: 'Create schedule entry with conflict checks' })
  @ApiResponse({ status: 201, type: ScheduleEntryDto })
  create(@Body() body: CreateScheduleEntryDto) {
    return this.scheduleService.create(body);
  }

  @Put(':id')
  @Roles(Role.DISPATCHER, Role.ADMIN)
  @ApiOperation({ summary: 'Update schedule entry with conflict checks' })
  @ApiResponse({ status: 200, type: ScheduleEntryDto })
  update(@Param('id') id: string, @Body() body: UpdateScheduleEntryDto) {
    return this.scheduleService.update(id, body);
  }

  @Delete(':id')
  @Roles(Role.DISPATCHER, Role.ADMIN)
  @ApiOperation({ summary: 'Delete schedule entry' })
  delete(@Param('id') id: string) {
    return this.scheduleService.delete(id);
  }
}
