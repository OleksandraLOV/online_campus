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

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  findMy(@Request() req: any) {
    return this.notificationsService.findByUser(req.user.sub);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    const count = await this.notificationsService.getUnreadCount(req.user.sub);
    return { count };
  }

  @Post()
  create(
    @Body()
    body: {
      title: string;
      message: string;
      type: string;
    },
  ) {
    return this.notificationsService.create(body);
  }

  @Patch(':id/read')
  markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.markAsRead(id, req.user.sub);
  }

  @Patch('read-all')
  markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsRead(req.user.sub);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Request() req: any) {
    return this.notificationsService.delete(id, req.user.sub);
  }

  @Delete()
  deleteAll(@Request() req: any) {
    return this.notificationsService.deleteAll(req.user.sub);
  }
}
