import { ApiProperty } from '@nestjs/swagger';

import { ActionLogInfo } from '@egofm-reward/shared';

/**
 * Data Transfer Object for action log information.
 */
export class ActionLogInfoDto implements ActionLogInfo {
  @ApiProperty({
    description: 'Unique identifier of the action log entry',
    example: 'c1a2b3c4-d5e6-7890-abcd-ef1234567890',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Unique identifier of the user',
    example: '9b3f94ae-0c72-4a5a-83b8-01cc2c9122a3',
    format: 'uuid',
  })
  userId: string;

  @ApiProperty({
    description: 'Unique identifier of the action',
    example: 'a3d4c2e1-1234-4567-8901-abcdef123456',
    format: 'uuid',
  })
  actionId: string;
}
