import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEnum, IsNumber, IsOptional, IsUUID } from 'class-validator';

import { RewardClaimInfo, RewardClaimStatus } from '@egofm-reward/shared';

/**
 * Data Transfer Object for reward claim information.
 */
export class RewardClaimInfoDto implements RewardClaimInfo {
  @ApiProperty({
    description: 'Unique identifier of the reward claim',
    example: '9b3f94ae-0c72-4a5a-83b8-01cc2c9122a3',
    format: 'uuid',
  })
  @IsUUID()
  id: string;

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

  @ApiProperty({
    description: 'The level the user had when the reward was claimed',
    example: 2,
    default: 1,
  })
  @IsNumber()
  levelId: number;

  @ApiProperty({
    description: 'Timestamp when the reward was claimed',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  claimedAt: Date;

  @ApiPropertyOptional({
    description: 'Status of the reward claim',
    enum: RewardClaimStatus,
    default: RewardClaimStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(RewardClaimStatus)
  status?: RewardClaimStatus;
}
