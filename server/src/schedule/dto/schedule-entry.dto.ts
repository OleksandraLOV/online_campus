import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ScheduleEntryStatus, ScheduleEntryType } from '../schemas';

export class ScheduleEntryDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  courseAssignmentId: string;

  @ApiPropertyOptional()
  classroomId?: string;

  @ApiProperty()
  date: string;

  @ApiProperty()
  startTime: string;

  @ApiProperty()
  endTime: string;

  @ApiProperty({ enum: ScheduleEntryType })
  type: ScheduleEntryType;

  @ApiProperty({ enum: ScheduleEntryStatus })
  status: ScheduleEntryStatus;

  @ApiPropertyOptional()
  courseName?: string;

  @ApiPropertyOptional()
  courseCode?: string;

  @ApiPropertyOptional()
  groupCode?: string;

  @ApiPropertyOptional()
  teacherId?: string;

  @ApiPropertyOptional()
  teacherName?: string;

  @ApiPropertyOptional()
  classroom?: string;

  @ApiPropertyOptional()
  createdAt?: string;

  @ApiPropertyOptional()
  updatedAt?: string;
}
