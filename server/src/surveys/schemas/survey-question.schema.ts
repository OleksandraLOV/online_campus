import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Survey } from './survey.schema';
import { SurveyQuestionType } from './survey.enums';

export type SurveyQuestionDocument = SurveyQuestion & Document;

@Schema({ timestamps: true })
export class SurveyQuestion {
  @Prop({ type: Types.ObjectId, ref: Survey.name, required: true, index: true })
  survey: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(SurveyQuestionType),
    required: true,
  })
  type: SurveyQuestionType;

  @Prop({ required: true, trim: true, maxlength: 1000 })
  text: string;

  @Prop({ type: [String], default: [] })
  options: string[];

  @Prop({ type: Boolean, default: true })
  required: boolean;

  @Prop({ type: Number, required: true, min: 0 })
  order: number;

  createdAt: Date;
  updatedAt: Date;
}

export const SurveyQuestionSchema =
  SchemaFactory.createForClass(SurveyQuestion);

SurveyQuestionSchema.index({ survey: 1, order: 1 }, { unique: true });
