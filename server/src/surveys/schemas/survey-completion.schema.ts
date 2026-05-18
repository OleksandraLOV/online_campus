import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Survey } from './survey.schema';
import { User } from '../../users/schemas';

export type SurveyCompletionDocument = SurveyCompletion & Document;

@Schema({ timestamps: true })
export class SurveyCompletion {
  @Prop({ type: Types.ObjectId, ref: Survey.name, required: true, index: true })
  survey: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  user: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  completedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const SurveyCompletionSchema =
  SchemaFactory.createForClass(SurveyCompletion);

SurveyCompletionSchema.index({ survey: 1, user: 1 }, { unique: true });
