import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SurveyStatus, SurveyTargetType } from '../schemas';

export class SurveyQueryDto {
  @ApiPropertyOptional({ enum: SurveyStatus })
  @IsOptional()
  @IsEnum(SurveyStatus)
  status?: SurveyStatus;

  @ApiPropertyOptional({ enum: SurveyTargetType })
  @IsOptional()
  @IsEnum(SurveyTargetType)
  targetType?: SurveyTargetType;
}
