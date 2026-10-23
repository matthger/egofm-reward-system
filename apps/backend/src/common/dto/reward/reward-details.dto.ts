import { ApiProperty } from '@nestjs/swagger';

import { RewardDetails } from '@egofm-reward/shared';

import { RewardInfoDto } from './reward-info.dto';

/**
 * Data Transfer Object representing detailed information about a reward.
 */
export class RewardDetailsDto extends RewardInfoDto implements RewardDetails {
  @ApiProperty({ description: 'Whether the reward is currently active', default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Whether the reward is automatically granted', default: false })
  isAutomated: boolean;
}
