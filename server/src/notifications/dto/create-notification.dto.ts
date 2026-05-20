import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export enum NotificationType {
  SCHEDULE_CHANGE = 'schedule_change',
  NEW_ASSIGNMENT = 'new_assignment',
  NEW_SURVEY = 'new_survey',
  GRADE = 'grade',
  ANNOUNCEMENT = 'announcement',
  SYSTEM = 'system',
}

export class CreateNotificationDto {
  @ApiProperty({ example: 'Важливе оголошення' })
  @IsString()
  @MaxLength(120)
  title: string;

  @ApiProperty({ example: 'Заняття перенесено на 14:00.' })
  @IsString()
  @MaxLength(2000)
  message: string;

  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional({ description: 'Target user id. Empty means broadcast.' })
  @IsOptional()
  @IsMongoId()
  userId?: string;

  @ApiPropertyOptional({ enum: ['all', 'group'] })
  @IsOptional()
  @IsIn(['all', 'group'])
  targetType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsMongoId()
  groupId?: string;
}