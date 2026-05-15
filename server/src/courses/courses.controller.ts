import {Controller, Get, Post, Param, UseGuards, Request, UseInterceptors, UploadedFile, Body} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard, Roles } from '../auth/roles.guard';
import { Role } from '../common/types/roles.enum';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('courses')
@ApiBearerAuth()
@Controller('courses')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  findAll() {
    return this.coursesService.findAllCourses();
  }

  @Get('my')
  findMy(@Request() req: any) {
    const { sub, role } = req.user;
    if (role === Role.STUDENT) {
      return this.coursesService.findCoursesByStudent(sub);
    }
    if (role === Role.TEACHER || role === Role.DEPARTMENT_HEAD) {
      return this.coursesService.findCoursesByTeacher(sub);
    }
    return this.coursesService.findAllCourses();
  }

  @Get(':courseAssignmentId/materials')
  getMaterials(@Param('courseAssignmentId') caId: string) {
    return this.coursesService.findMaterials(caId);
  }

  @Get(':courseAssignmentId/assignments')
  getAssignments(@Param('courseAssignmentId') caId: string) {
    return this.coursesService.findAssignments(caId);
  }

  @Get(':courseAssignmentId/grades')
  @Roles(Role.TEACHER, Role.DEPARTMENT_HEAD, Role.DEAN, Role.ADMIN)
  getGradeJournal(@Param('courseAssignmentId') caId: string) {
    return this.coursesService.findGradesByCourseAssignment(caId);
  }

  @Get('assignments/my')
  getMyAssignments(@Request() req: any) {
    return this.coursesService.findAssignmentsByStudent(req.user.sub);
  }

  @Get('grades/my')
  getMyGrades(@Request() req: any) {
    return this.coursesService.findGradesByStudent(req.user.sub);
  }

  @Get('assignments/:assignmentId/submissions')
  @Roles(Role.TEACHER, Role.DEPARTMENT_HEAD, Role.ADMIN)
  getSubmissions(@Param('assignmentId') assignmentId: string) {
    return this.coursesService.findSubmissions(assignmentId);
  }
  @Post(':courseAssignmentId/materials')
  @Roles(Role.TEACHER, Role.DEPARTMENT_HEAD, Role.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  uploadMaterial(
    @Param('courseAssignmentId') caId: string,
    @Body('title') title: string,
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.coursesService.saveMaterial(caId, title, file, req.user.sub);
  }

  @Post('assignments/:assignmentId/submit')
  @Roles(Role.STUDENT)
  @UseInterceptors(FileInterceptor('file'))
  submitAssignment(
    @Param('assignmentId') assignmentId: string,
    @Request() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.coursesService.submitAssignment(assignmentId, req.user.sub, file);
  }
  }

