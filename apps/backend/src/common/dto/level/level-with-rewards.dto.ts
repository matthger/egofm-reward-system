import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { LevelInfoDto } from './level-info.dto';
import { RewardDetailsDto } from '../reward/reward-details.dto';

/**
 * Data Transfer Object for a level that includes associated rewards.
 */
export class LevelWithRewardsDto extends LevelInfoDto {
  @ApiProperty({
    type: [RewardDetailsDto],
    description: 'List of rewards associated with the level',
  })
  @ValidateNested({ each: true })
  @Type(() => RewardDetailsDto)
  rewards: Array<RewardDetailsDto>;
}
