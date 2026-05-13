import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

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

  async create(data: {
    title: string;
    message: string;
    type: string;
    userId?: string;
  }) {
    return this.notificationModel.create({
      title: data.title,
      message: data.message,
      type: data.type,
      userId: data.userId ? new Types.ObjectId(data.userId) : null,
    });
  }

  async findByUser(userId: string) {
    const userObjId = new Types.ObjectId(userId);

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
    const userObjId = new Types.ObjectId(userId);

    return this.notificationModel.countDocuments({
      $or: [{ userId: userObjId }, { userId: null }],
      readBy: { $nin: [userObjId] },
    });
  }

  async markAsRead(id: string, userId: string) {
    const userObjId = new Types.ObjectId(userId);

    return this.notificationModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        $or: [{ userId: userObjId }, { userId: null }],
      },
      { $addToSet: { readBy: userObjId } },
      { new: true },
    );
  }

  async markAllAsRead(userId: string) {
    const userObjId = new Types.ObjectId(userId);

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
    const userObjId = new Types.ObjectId(userId);
    return this.notificationModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      $or: [{ userId: userObjId }, { userId: null }],
    });
  }

  async deleteAll(userId: string) {
    const userObjId = new Types.ObjectId(userId);
    return this.notificationModel.deleteMany({
      userId: userObjId,
    });
  }
}
