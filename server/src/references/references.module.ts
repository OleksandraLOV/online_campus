import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Assignment,
  AssignmentSchema,
  Course,
  CourseAssignment,
  CourseAssignmentSchema,
  CourseSchema,
} from '../courses/schemas';
import { ScheduleModule } from '../schedule/schedule.module';
import { Survey, SurveySchema } from '../surveys/schemas';
import { User, UserSchema } from '../users/schemas';
import { ReferencesController } from './references.controller';
import {
  Classroom,
  ClassroomSchema,
  Department,
  DepartmentSchema,
  Faculty,
  FacultySchema,
  Group,
  GroupSchema,
  Specialty,
  SpecialtySchema,
} from './schemas';
import { GroupsService } from './groups.service';
import { ClassroomsService } from './classrooms.service';
import { DepartmentsService } from './departments.service';
import { FacultiesService } from './faculties.service';
import { SpecialtiesService } from './specialties.service';
import { ReferenceIntegrityService } from './reference-integrity.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Group.name, schema: GroupSchema },
      { name: Classroom.name, schema: ClassroomSchema },
      { name: Department.name, schema: DepartmentSchema },
      { name: Faculty.name, schema: FacultySchema },
      { name: Specialty.name, schema: SpecialtySchema },
      { name: User.name, schema: UserSchema },
      { name: Course.name, schema: CourseSchema },
      { name: CourseAssignment.name, schema: CourseAssignmentSchema },
      { name: Assignment.name, schema: AssignmentSchema },
      { name: Survey.name, schema: SurveySchema },
    ]),
    ScheduleModule,
  ],
  controllers: [ReferencesController],
  providers: [
    ReferenceIntegrityService,
    GroupsService,
    ClassroomsService,
    DepartmentsService,
    FacultiesService,
    SpecialtiesService,
  ],
})
export class ReferencesModule {}
