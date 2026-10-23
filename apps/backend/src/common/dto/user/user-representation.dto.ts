import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { UserDetailsDto } from './user-details.dto';
import { ActionLogDetailsDto } from '../action-log/action-log-details.dto';
import { RewardClaimInfoDto } from '../reward-claim/reward-claim-info.dto';

/**
 * Data Transfer Object for user representation that includes action logs and reward claims.
 */
export class UserRepresentationDto extends UserDetailsDto {
  @ApiProperty({
    type: [ActionLogDetailsDto],
    description: 'List of action logs performed by the user',
  })
  @ValidateNested({ each: true })
  @Type(() => ActionLogDetailsDto)
  actionLogs: Array<ActionLogDetailsDto>;

  @ApiProperty({
    type: [RewardClaimInfoDto],
    description: 'List of reward claims performed by the user',
  })
  @ValidateNested({ each: true })
  @Type(() => RewardClaimInfoDto)
  rewardClaims: Array<RewardClaimInfoDto>;
}
