import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString, IsUUID, Min } from 'class-validator';

import { ActionInfo, ActionEnum } from '@egofm-reward/shared';

/**
 * Data Transfer Object for action information.
 */
export class ActionInfoDto implements ActionInfo {
  @ApiProperty({ example: 'a3d4c2e1-1234-4567-8901-abcdef123456' })
  @IsUUID()
  id: string;

  @ApiProperty({ enum: ActionEnum, example: ActionEnum.ONE_HOUR_STREAMED })
  @IsEnum(ActionEnum)
  name: ActionEnum;

  @ApiProperty({ example: '1h egoFM hören', description: 'Title of the action' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Punkte fürs aktive Zuhören', description: 'Description of the action' })
  @IsString()
  description: string;

  @ApiProperty({ example: 20, description: 'Points rewarded for this action' })
  @IsInt()
  @Min(0)
  points: number;
}
