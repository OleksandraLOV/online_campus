import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  HttpCode,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { LogoutDto } from './dto/logout.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-password-reset.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { RequestWithId } from '../common/middleware/request-id.middleware';

interface RequestWithUser extends RequestWithId {
  user: { sub: string; login: string; role?: string };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 10, ttl: 900000 } })
  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 201, type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Невірний логін або пароль' })
  @ApiResponse({ status: 403, description: 'Обліковий запис заблоковано' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  async login(@Body() body: LoginDto, @Req() req: RequestWithId) {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';
    return this.authService.login(
      body.login,
      body.password,
      ip,
      userAgent,
      req.requestId,
    );
  }

  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @Post('password-reset/request')
  @HttpCode(200)
  @ApiOperation({ summary: 'Request password reset token' })
  @ApiBody({ type: RequestPasswordResetDto })
  @ApiResponse({
    status: 200,
    description: 'Generic password reset instructions response',
  })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  requestPasswordReset(
    @Body() body: RequestPasswordResetDto,
    @Req() req: RequestWithId,
  ) {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';
    return this.authService.requestPasswordReset(
      body,
      ip,
      userAgent,
      req.requestId,
    );
  }

  @Throttle({ default: { limit: 5, ttl: 900000 } })
  @Post('password-reset/confirm')
  @HttpCode(200)
  @ApiOperation({ summary: 'Confirm password reset with token' })
  @ApiBody({ type: ConfirmPasswordResetDto })
  @ApiResponse({ status: 200, description: 'Password reset completed' })
  @ApiResponse({ status: 400, description: 'Invalid or expired reset token' })
  @ApiResponse({ status: 429, description: 'Too Many Requests' })
  confirmPasswordReset(
    @Body() body: ConfirmPasswordResetDto,
    @Req() req: RequestWithId,
  ) {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';
    return this.authService.confirmPasswordReset(
      body,
      ip,
      userAgent,
      req.requestId,
    );
  }

  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiBody({ type: RefreshDto })
  @ApiResponse({ status: 200, description: 'New access/refresh tokens issued' })
  @ApiResponse({ status: 401, description: 'Невірний refresh token' })
  refresh(@Body() body: RefreshDto, @Req() req: RequestWithId) {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';
    return this.authService.refresh(
      body.refreshToken,
      ip,
      userAgent,
      req.requestId,
    );
  }

  @Throttle({ default: { limit: 30, ttl: 60000 } })
  @Post('logout')
  @ApiOperation({ summary: 'Logout (revoke refresh token)' })
  @ApiBody({ type: LogoutDto })
  @ApiResponse({ status: 200, description: 'Logged out' })
  @ApiResponse({ status: 401, description: 'Невірний refresh token' })
  logout(@Body() body: LogoutDto, @Req() req: RequestWithId) {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';
    return this.authService.logout(
      body.refreshToken,
      ip,
      userAgent,
      req.requestId,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @ApiOperation({ summary: 'Change user password' })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Пароль успішно змінено' })
  @ApiResponse({ status: 400, description: 'Невірний старий пароль' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @Body() body: ChangePasswordDto,
    @Req() req: RequestWithUser,
  ) {
    const ip = req.ip || req.socket?.remoteAddress || 'unknown';
    const userAgent = req.get('user-agent') || 'unknown';
    return this.authService.changePassword(
      req.user.sub,
      body,
      ip,
      userAgent,
      req.requestId,
    );
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Req() req: RequestWithUser) {
    return this.authService.getProfile(req.user.sub);
  }
}
