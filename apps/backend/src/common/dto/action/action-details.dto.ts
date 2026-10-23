import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsBoolean, IsOptional, Min, IsDate } from 'class-validator';

import { ActionDetails, ActionInterval } from '@egofm-reward/shared';

import { ActionInfoDto } from './action-info.dto';

/**
 * Data Transfer Object for action details.
 */
export class ActionDetailsDto extends ActionInfoDto implements ActionDetails {
  @ApiProperty({ enum: ActionInterval, example: ActionInterval.DAILY })
  @IsEnum(ActionInterval)
  interval: ActionInterval;

  @ApiProperty({
    example: 5,
    description: 'Maximum times this action can be rewarded per day (null = unlimited)',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxPerDay?: number | null;

  @ApiProperty({ example: true, description: 'Whether user needs to provide proof' })
  @IsBoolean()
  requiresProof: boolean;

  @ApiProperty({ example: true, description: 'Whether the action is currently active' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T12:00:00Z' })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({ example: '2025-01-02T12:00:00Z' })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}
