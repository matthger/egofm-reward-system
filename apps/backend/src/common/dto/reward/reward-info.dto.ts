import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { RewardInfo, RewardEnum } from '@egofm-reward/shared';

/**
 * Data Transfer Object representing basic information about a reward.
 */
export class RewardInfoDto implements RewardInfo {
  @ApiProperty({
    description: 'UUID of the reward',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({ description: 'ID of the level this reward belongs to', example: 1 })
  levelId: number;

  @ApiProperty({ enum: RewardEnum, example: RewardEnum.STREAM_SHOUTOUT })
  @IsEnum(RewardEnum)
  name: RewardEnum;

  @ApiProperty({ description: 'Title of the reward', example: 'Shoutout' })
  title: string;

  @ApiProperty({
    description: 'Description of the reward',
    example: 'Get a personalized shoutout on air for your support!',
  })
  description: string;

  @ApiProperty({
    description: 'Image URL for the reward',
    example: 'https://example.com/image.png',
  })
  imageUrl: string;
}
