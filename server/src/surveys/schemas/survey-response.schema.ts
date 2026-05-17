import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Survey } from './survey.schema';
import { SurveyQuestion } from './survey-question.schema';
import { User } from '../../users/schemas';

export interface SurveyAnswer {
  question: Types.ObjectId;
  value: unknown;
}

const SurveyAnswerSchema = new MongooseSchema<SurveyAnswer>(
  {
    question: {
      type: MongooseSchema.Types.ObjectId,
      ref: SurveyQuestion.name,
      required: true,
    },
    value: { type: MongooseSchema.Types.Mixed, required: true },
  },
  { _id: false },
);

export type SurveyResponseDocument = SurveyResponse & Document;

@Schema({ timestamps: true })
export class SurveyResponse {
  @Prop({ type: Types.ObjectId, ref: Survey.name, required: true, index: true })
  survey: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, default: null, index: true })
  user: Types.ObjectId | null;

  @Prop({ type: [SurveyAnswerSchema], default: [] })
  answers: SurveyAnswer[];

  @Prop({ type: Date, default: Date.now, index: true })
  submittedAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const SurveyResponseSchema =
  SchemaFactory.createForClass(SurveyResponse);

SurveyResponseSchema.index(
  { survey: 1, user: 1 },
  {
    unique: true,
    partialFilterExpression: { user: { $type: 'objectId' } },
  },
);
