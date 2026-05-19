import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role } from '../common/types/roles.enum';
import { CreateNotificationDto } from './dto/create-notification.dto';
import {
  Notification,
  NotificationDocument,
} from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<NotificationDocument>,
  ) {}

  async create(data: CreateNotificationDto) {
    return this.notificationModel.create({
      title: data.title,
      message: data.message,
      type: data.type,
      userId: data.userId ? new Types.ObjectId(data.userId) : null,
    });
  }

  async findByUser(userId: string) {
    const userObjId = this.toObjectId(userId);

    const notifications = await this.notificationModel
      .find({
        $or: [{ userId: userObjId }, { userId: null }],
      })
      .sort({ createdAt: -1 });

    return notifications.map((n) => ({
      ...n.toObject({ virtuals: true }),
      readFlag: n.readBy?.some((id) => id.equals(userObjId)) ?? false,
    }));
  }

  async getUnreadCount(userId: string) {
    const userObjId = this.toObjectId(userId);

    return this.notificationModel.countDocuments({
      $or: [{ userId: userObjId }, { userId: null }],
      readBy: { $nin: [userObjId] },
    });
  }

  async markAsRead(id: string, userId: string) {
    const userObjId = this.toObjectId(userId);

    return this.notificationModel.findOneAndUpdate(
      {
        _id: this.toObjectId(id),
        $or: [{ userId: userObjId }, { userId: null }],
      },
      { $addToSet: { readBy: userObjId } },
      { new: true },
    );
  }

  async markAllAsRead(userId: string) {
    const userObjId = this.toObjectId(userId);

    await this.notificationModel.updateMany(
      {
        $or: [{ userId: userObjId }, { userId: null }],
        readBy: { $nin: [userObjId] },
      },
      { $addToSet: { readBy: userObjId } },
    );

    return { success: true };
  }

  async delete(id: string, userId: string, role: Role) {
    const notification = await this.notificationModel.findById(
      this.toObjectId(id),
    );

    if (!notification) {
      throw new NotFoundException('Сповіщення не знайдено');
    }

    if (notification.userId === null && role !== Role.ADMIN) {
      throw new ForbiddenException(
        'Немає прав для видалення глобального сповіщення',
      );
    }

    if (
      notification.userId !== null &&
      notification.userId.toString() !== userId &&
      role !== Role.ADMIN
    ) {
      throw new ForbiddenException('Немає прав для видалення цього сповіщення');
    }

    await notification.deleteOne();
    return { success: true };
  }

  async deleteAll(userId: string) {
    const userObjId = this.toObjectId(userId);
    return this.notificationModel.deleteMany({
      userId: userObjId,
    });
  }

  private toObjectId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Некоректний ID');
    }

    return new Types.ObjectId(id);
  }
}
