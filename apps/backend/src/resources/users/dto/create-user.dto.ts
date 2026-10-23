import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { CreateUser } from '@egofm-reward/shared';

/**
 * DTO for creating a new user.
 */
export class CreateUserDto implements CreateUser {
  @IsEmail()
  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'user123' })
  username: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({ example: 'StrongPassword123' })
  password: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ example: '1995-05-10', required: false })
  birthDate?: string;
}
