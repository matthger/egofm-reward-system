import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { Login } from '@egofm-reward/shared';

/**
 * Login Data Transfer Object (DTO) for user authentication.
 */
export class LoginDto implements Login {
  @ApiProperty({ example: 'listener' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'test' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
