import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

import { ActionInterval, ActionEnum, CreateAction } from '@egofm-reward/shared';

/**
 * Data Transfer Object for creating an action.
 */
export class CreateActionDto implements CreateAction {
  @ApiProperty({ enum: ActionEnum, example: ActionEnum.ONE_HOUR_STREAMED })
  @IsEnum(ActionEnum)
  name: ActionEnum;

  @IsString()
  @ApiProperty({ example: '1h egoFM hören', description: 'Title of the action' })
  title: string;

  @IsString()
  @ApiProperty({
    example: 'Punkte fürs aktive Zuhören',
    description: 'Human-readable description of the action',
  })
  description: string;

  @IsInt()
  @Min(0)
  @ApiProperty({
    example: 20,
    description: 'Number of points rewarded for performing this action',
  })
  points: number;

  @IsEnum(ActionInterval)
  @ApiProperty({
    enum: ActionInterval,
    example: ActionInterval.DAILY,
    description: 'Interval defining how often this action can be rewarded',
  })
  interval: ActionInterval;

  @IsOptional()
  @IsInt()
  @Min(1)
  @ApiProperty({
    example: 5,
    required: false,
    description: 'Maximum number of times this action can be rewarded per day (null = unlimited)',
  })
  maxPerDay?: number | null;

  @IsBoolean()
  @ApiProperty({
    example: false,
    description: 'Whether this action requires the user to submit a proof (e.g. image, code)',
  })
  requiresProof: boolean;

  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Whether this action is currently active and should be shown to users',
  })
  isActive: boolean;
}
