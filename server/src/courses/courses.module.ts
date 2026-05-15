import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { FilesModule } from '../files/files.module';

@Module({
  imports: [FilesModule],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
