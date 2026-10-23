import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsOptional, IsObject } from 'class-validator';

import { ActionLogMetadata, CreateActionLog } from '@egofm-reward/shared';

/**
 * DTO for creating a new ActionLog entry.
 */
export class CreateActionLogDto implements CreateActionLog {
  /**
   * UUID of the user who performed the action.
   */
  @ApiProperty({
    example: 'd1a2b3c4-e5f6-7890-abcd-ef1234567890',
    description: 'UUID of the user who performed the action.',
  })
  @IsUUID()
  userId: string;

  /**
   * UUID of the action that was performed.
   */
  @ApiProperty({
    example: 'f0e1d2c3-b4a5-6789-abcd-ef0987654321',
    description: 'UUID of the action that was performed.',
  })
  @IsUUID()
  actionId: string;

  /**
   * Optional metadata associated with the action.
   * Can include context like amount, platform, etc.
   */
  @ApiPropertyOptional({
    description: 'Optional metadata about the action.',
    example: { amount: 10, platform: 'instagram' },
  })
  @IsOptional()
  @IsObject()
  metadata?: ActionLogMetadata;
}
