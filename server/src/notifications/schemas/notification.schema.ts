import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: Types.ObjectId, ref: 'User', default: null })
  userId: Types.ObjectId | null;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({
    required: true,
    enum: [
      'schedule_change',
      'new_assignment',
      'new_survey',
      'grade',
      'announcement',
      'system',
    ],
  })
  type: string;

  @Prop({
    required: true,
    enum: ['all', 'group'],
    default: 'all',
  })
  targetType: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Group',
    default: null,
  })
  groupId: Types.ObjectId | null;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  readBy: Types.ObjectId[];

  @Prop({ default: false })
  important: boolean;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  dismissedBy: Types.ObjectId[];
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);