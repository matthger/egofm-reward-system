import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

import { ActionLogStatus, UpdateActionLog } from '@egofm-reward/shared';

import { CreateActionLogDto } from './create-action-log.dto';

/**
 * Data Transfer Object for updating action logs.
 */
export class UpdateActionLogDto extends PartialType(CreateActionLogDto) implements UpdateActionLog {
  @ApiPropertyOptional({
    description: 'Status of the action log',
    enum: ActionLogStatus,
    default: ActionLogStatus.CLAIMABLE,
  })
  @IsOptional()
  @IsEnum(ActionLogStatus)
  status?: ActionLogStatus;
}
