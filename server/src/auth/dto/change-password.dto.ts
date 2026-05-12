import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123' })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    example: 'newPassword123!',
    description:
      'Пароль має містити велику і малу літери, та цифру або спецсимвол',
  })
  @IsString()
  @MinLength(8, { message: 'Пароль має бути не коротшим за 8 символів' })
  @MaxLength(50)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Пароль має містити хоча б одну велику літеру, одну малу та одну цифру',
  })
  newPassword: string;
}
