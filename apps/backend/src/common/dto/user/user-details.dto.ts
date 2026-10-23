import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional } from 'class-validator';

import { Role, UserDetails } from '@egofm-reward/shared';

import { UserInfoDto } from './user-info.dto';

/**
 * Data Transfer Object for user details.
 */
export class UserDetailsDto extends UserInfoDto implements UserDetails {
  @ApiProperty({ enum: Role, example: Role.USER })
  @IsEnum(Role)
  role: Role;

  @ApiPropertyOptional({
    description: 'Date of birth',
    type: String,
    format: 'date',
    example: '1990-05-15',
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthDate?: Date;

  @ApiProperty({
    description: 'Current login streak count',
    example: 5,
    default: 0,
  })
  @IsNumber()
  currentStreak: number;

  @ApiProperty({
    description: 'Current points collected by the user',
    example: 500,
    default: 0,
  })
  @IsNumber()
  points: number;

  @ApiProperty({
    description: 'Current user level',
    example: 2,
    default: 1,
  })
  @IsNumber()
  levelId: number;

  @ApiPropertyOptional({
    description: 'Last login timestamp',
    type: String,
    format: 'date-time',
    example: '2025-05-31T18:45:00.000Z',
    nullable: true,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastLogin?: Date;
}
