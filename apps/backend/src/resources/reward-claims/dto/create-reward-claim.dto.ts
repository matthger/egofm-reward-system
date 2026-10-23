import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsEnum, IsNumber } from 'class-validator';

import { CreateRewardClaim, RewardClaimStatus } from '@egofm-reward/shared';

/**
 * Data Transfer Object for creating a reward claim.
 */
export class CreateRewardClaimDto implements CreateRewardClaim {
  @ApiProperty({
    description: 'UUID of the user claiming the reward',
    example: 'b9d29520-4ac2-4b0d-a273-4a21c66a8320',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'UUID of the reward to be claimed',
    example: 'f2f55745-d2e2-4ccf-a1a9-60900b13a4cf',
  })
  @IsUUID()
  rewardId: string;

  @ApiProperty({ example: 2, description: 'Unique identifier for the level' })
  @IsNumber()
  @IsOptional()
  levelId?: string;

  @ApiPropertyOptional({
    description: 'Status of the reward claim',
    enum: RewardClaimStatus,
    default: RewardClaimStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(RewardClaimStatus)
  status?: RewardClaimStatus;
}
