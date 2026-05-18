import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Body,
  Request,
  UseGuards,
} from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthenticatedRequest } from '../common/types/authenticated-request';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { Role } from '../common/types/roles.enum';
import { CreateNotificationDto } from './dto/create-notification.dto';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  findMy(@Request() req: AuthenticatedRequest) {
    return this.notificationsService.findByUser(req.user.sub);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: AuthenticatedRequest) {
    const count = await this.notificationsService.getUnreadCount(req.user.sub);
    return { count };
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() body: CreateNotificationDto) {
    return this.notificationsService.create(body);
  }

  @Post('broadcast')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  broadcast(@Body() body: CreateNotificationDto) {
    return this.notificationsService.create(body);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.notificationsService.markAsRead(id, req.user.sub);
  }

  @Patch('read-all')
  markAllAsRead(@Request() req: AuthenticatedRequest) {
    return this.notificationsService.markAllAsRead(req.user.sub);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    return this.notificationsService.delete(id, req.user.sub, req.user.role);
  }

  @Delete()
  deleteAll(@Request() req: AuthenticatedRequest) {
    return this.notificationsService.deleteAll(req.user.sub);
  }
}
