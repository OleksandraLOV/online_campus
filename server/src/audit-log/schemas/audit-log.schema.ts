import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop({ default: () => new Date() })
  timestamp: Date;

  @Prop({ type: String, default: null })
  userId: string | null;

  @Prop({ required: true })
  userLogin: string;

  @Prop({ type: String })
  userRole?: string;

  @Prop({ required: true })
  action: string;

  @Prop({ type: String })
  targetEntity?: string;

  @Prop({ type: String })
  targetId?: string;

  @Prop({ type: Object })
  details?: Record<string, unknown>;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ required: true })
  userAgent: string;

  @Prop({ required: true, enum: ['success', 'failure'] })
  result: 'success' | 'failure';

  @Prop({ type: String })
  requestId?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

AuditLogSchema.index({ timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ userLogin: 1, timestamp: -1 });
AuditLogSchema.index({ result: 1, timestamp: -1 });
AuditLogSchema.index({ userRole: 1, timestamp: -1 });
AuditLogSchema.index({ targetEntity: 1, timestamp: -1 });
