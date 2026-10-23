import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { UserInfoDto } from './user-info.dto';
import { ActionLogDetailsDto } from '../action-log/action-log-details.dto';

/**
 * Data Transfer Object for user information with associated action logs.
 */
export class UserWithActionLogsDto extends UserInfoDto {
  @ApiProperty({
    type: [ActionLogDetailsDto],
    description: 'List of action logs performed by the user',
  })
  @ValidateNested({ each: true })
  @Type(() => ActionLogDetailsDto)
  actionLogs: Array<ActionLogDetailsDto>;
}
