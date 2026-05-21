import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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

  async createMany(items: CreateNotificationDto[]) {
    if (items.length === 0) {
      return [];
    }

    return this.notificationModel.insertMany(
      items.map((data) => ({
        title: data.title,
        message: data.message,
        type: data.type,
        userId: data.userId ? new Types.ObjectId(data.userId) : null,
      })),
      { ordered: false },
    );
  }

  async findByUser(userId: string) {
    const userObjId = this.toObjectId(userId);

    const notifications = await this.notificationModel
      .find({
        $or: [{ userId: userObjId }, { userId: null }],
        dismissedBy: { $nin: [userObjId] },
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
      dismissedBy: { $nin: [userObjId] },
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

  async delete(id: string, userId: string) {
    const userObjId = this.toObjectId(userId);
    const notification = await this.notificationModel.findById(
      this.toObjectId(id),
    );

    if (!notification) {
      throw new NotFoundException('Сповіщення не знайдено');
    }

    await this.notificationModel.findByIdAndUpdate(this.toObjectId(id), {
      $addToSet: { dismissedBy: userObjId },
    });

    return { success: true };
  }

  async dismissAll(userId: string) {
    const userObjId = this.toObjectId(userId);

    await this.notificationModel.updateMany(
      {
        $or: [{ userId: userObjId }, { userId: null }],
        dismissedBy: { $nin: [userObjId] },
      },
      { $addToSet: { dismissedBy: userObjId } },
    );

    return { success: true };
  }

  private toObjectId(id: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Некоректний ID');
    }

    return new Types.ObjectId(id);
  }
}
