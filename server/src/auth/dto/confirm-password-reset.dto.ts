import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

function trimString(value: unknown): unknown {
  return typeof value === 'string' ? value.trim() : value;
}

export class ConfirmPasswordResetDto {
  @ApiProperty({ description: 'Password reset token from recovery link' })
  @Transform(({ value }) => trimString(value))
  @IsString()
  @MinLength(32)
  @MaxLength(200)
  token: string;

  @ApiProperty({
    example: 'NewPassword123!',
    description:
      'Пароль має містити велику і малу літери, та цифру або спецсимвол',
  })
  @IsString()
  @MinLength(8, { message: 'Пароль має бути не коротшим за 8 символів' })
  @MaxLength(50)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Пароль має містити хоча б одну велику літеру, одну малу та одну цифру або спецсимвол',
  })
  newPassword: string;
}
