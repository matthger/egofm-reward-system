import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsEmail, IsString, IsDate } from 'class-validator';

import { UserInfo } from '@egofm-reward/shared';

/**
 * Data Transfer Object for user information.
 */
export class UserInfoDto implements UserInfo {
  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '9b3f94ae-0c72-4a5a-83b8-01cc2c9122a3',
    format: 'uuid',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Unique username',
    example: 'john_doe',
  })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'Timestamp when the user joined',
    type: String,
    format: 'date-time',
    example: '2025-06-01T12:34:56.000Z',
  })
  @IsDate()
  joinedAt: Date;
}
