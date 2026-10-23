import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { UserInfoDto } from './user-info.dto';
import { RewardClaimInfoDto } from '../reward-claim/reward-claim-info.dto';

/**
 * Data Transfer Object for user information with associated action logs.
 */
export class UserWithRewardClaimsDto extends UserInfoDto {
  @ApiProperty({
    type: [RewardClaimInfoDto],
    description: 'List of reward claims performed by the user',
  })
  @ValidateNested({ each: true })
  @Type(() => RewardClaimInfoDto)
  rewardClaims: Array<RewardClaimInfoDto>;
}
