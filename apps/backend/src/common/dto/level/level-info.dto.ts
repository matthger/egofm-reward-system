import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { LevelInfo } from '@egofm-reward/shared';

/**
 * Data Transfer Object for Level Information
 */
export class LevelInfoDto implements LevelInfo {
  @ApiProperty({ example: 2, description: 'Unique numeric ID of the level' })
  id: number;

  @ApiProperty({ example: 'Supporter', description: 'Name of the level' })
  name: string;

  @ApiProperty({ example: 500, description: 'Minimum points required for this level' })
  minPoints: number;

  @ApiPropertyOptional({
    example: 1499,
    description: 'Maximum points before the next level. Null means this is the highest level.',
    nullable: true,
  })
  maxPoints: number | null;

  @ApiProperty({
    example: 'https://cdn.egofm.de/images/levels/supporter.png',
    description: 'URL to the level badge or icon',
  })
  imageUrl: string;
}
