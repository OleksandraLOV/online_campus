import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { ConfigService } from '@nestjs/config';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    AuditLogModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService): JwtModuleOptions => {
        const expiresInVal = config.get<string>('JWT_EXPIRES_IN') || '15m';

        const jwtConfig: JwtModuleOptions = {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {},
        };

        if (jwtConfig.signOptions) {
          Object.assign(jwtConfig.signOptions, { expiresIn: expiresInVal });
        }

        return jwtConfig;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
