import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CoursesModule } from './courses/courses.module';
import { ReferencesModule } from './references/references.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ScheduleModule,
    CoursesModule,
    ReferencesModule,
    NotificationsModule,
  ],
})
export class AppModule {}
