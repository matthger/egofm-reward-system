import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  IsInt,
  Min,
  IsEnum,
} from 'class-validator';

import { CreateReward, RewardEnum } from '@egofm-reward/shared';

/**
 * Data Transfer Object for creating a new reward.
 */
export class CreateRewardDto implements CreateReward {
  @ApiProperty({ description: 'ID of the level this reward belongs to', example: 2 })
  @IsInt()
  @Min(0)
  levelId: number;

  @ApiProperty({ enum: RewardEnum, example: RewardEnum.STREAM_SHOUTOUT })
  @IsEnum(RewardEnum)
  name: RewardEnum;

  @ApiProperty({ description: 'Title of the reward', example: 'Shoutout' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Description of the reward',
    example: 'Get a personalized shoutout on air for your support!',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Image URL for the reward',
    example: 'https://example.com/image.png',
  })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({ description: 'Whether the reward is active', default: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiProperty({
    description: 'Whether the reward is granted automatically',
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isAutomated?: boolean = false;
}
