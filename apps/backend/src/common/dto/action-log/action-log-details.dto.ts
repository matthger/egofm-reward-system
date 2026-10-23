import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { ActionLogDetails, ActionLogMetadata, ActionLogStatus } from '@egofm-reward/shared';

import { ActionLogInfoDto } from './action-log-info.dto';

/**
 * Data Transfer Object for detailed action log information.
 */
export class ActionLogDetailsDto extends ActionLogInfoDto implements ActionLogDetails {
  @ApiProperty({ example: '2025-05-01T12:00:00.000Z', description: 'When the action was logged.' })
  createdAt: Date;

  @ApiPropertyOptional({
    description: 'Optional metadata about the action.',
    example: { amount: 10, platform: 'instagram' },
  })
  metadata: ActionLogMetadata;

  @ApiProperty({
    description: 'Status of the action log',
    enum: ActionLogStatus,
    default: ActionLogStatus.CLAIMABLE,
  })
  @IsOptional()
  @IsEnum(ActionLogStatus)
  status: ActionLogStatus;
}
