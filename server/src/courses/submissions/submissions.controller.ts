import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { SubmissionsService } from './submissions.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../../auth/roles.guard';
import { Role } from '../../common/types/roles.enum';
import { ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SubmissionDto, SubmitAssignmentDto } from './dto';
import { RequestWithUser } from '../../common/types/request-with-user.interface';
import { ApiPaginatedResponse } from '../../common/swagger/api-paginated.response';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginatedDto } from '../../common/dto/paginated.dto';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmissionsController {
  constructor(private submissionsService: SubmissionsService) {}

  @Get('assignments/:assignmentId/submissions')
  @Roles(Role.TEACHER, Role.DEPARTMENT_HEAD, Role.ADMIN)
  @ApiPaginatedResponse(SubmissionDto)
  async getSubmissions(
    @Param('assignmentId') assignmentId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedDto<SubmissionDto>> {
    return this.submissionsService.findSubmissions(assignmentId, paginationDto);
  }

  @Post('assignments/:id/submit')
  @Roles(Role.STUDENT)
  @ApiResponse({ type: SubmissionDto })
  async submitAssignment(
    @Param('id') id: string,
    @Body() dto: SubmitAssignmentDto,
    @Request() req: RequestWithUser,
  ): Promise<SubmissionDto> {
    return this.submissionsService.submitAssignment(id, dto, req.user.sub);
  }

  @Delete('assignments/:assignmentId/submissions/:studentId')
  @Roles(Role.TEACHER, Role.DEPARTMENT_HEAD, Role.ADMIN)
  async removeSubmission(
    @Param('assignmentId') assignmentId: string,
    @Param('studentId') studentId: string,
  ): Promise<{ success: boolean }> {
    return this.submissionsService.removeSubmission(assignmentId, studentId);
  }
  @Delete('assignments/:id/submit')
  @Roles(Role.STUDENT)
  async deleteOwnSubmission(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ) {
    return this.submissionsService.removeSubmission(id, req.user.sub);
  }
}
