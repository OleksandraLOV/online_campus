import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { Role } from '../common/types/roles.enum';
import { AuthenticatedRequest } from '../common/types/authenticated-request';
import { ScheduleEntry } from '../common/types/entities';
import { ScheduleService } from './schedule.service';

@ApiTags('schedule')
@ApiBearerAuth()
@Controller('schedule')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  findAll(
    @Query('date') date?: string,
    @Query('groupId') groupId?: string,
    @Query('teacherId') teacherId?: string,
  ) {
    if (date) return this.scheduleService.findByDate(date);
    if (groupId) return this.scheduleService.findByGroup(groupId);
    if (teacherId) return this.scheduleService.findByTeacher(teacherId);
    return this.scheduleService.findAll();
  }

  @Get('my')
  findMy(@Request() req: AuthenticatedRequest) {
    const { sub, role } = req.user;
    if (role === Role.STUDENT) {
      return this.scheduleService.findByStudent(sub);
    }
    if (role === Role.TEACHER || role === Role.DEPARTMENT_HEAD) {
      return this.scheduleService.findByTeacher(sub);
    }
    return this.scheduleService.findAll();
  }

  @Post()
  @Roles(Role.DISPATCHER, Role.ADMIN)
  create(@Body() body: Omit<ScheduleEntry, 'id'>) {
    return this.scheduleService.create(body);
  }

  @Put(':id')
  @Roles(Role.DISPATCHER, Role.ADMIN)
  update(@Param('id') id: string, @Body() body: Partial<ScheduleEntry>) {
    return this.scheduleService.update(id, body);
  }

  @Delete(':id')
  @Roles(Role.DISPATCHER, Role.ADMIN)
  delete(@Param('id') id: string) {
    return this.scheduleService.delete(id);
  }
}
