import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsUrl, IsNumber, IsOptional, Min } from 'class-validator';

import { CreateLevel } from '@egofm-reward/shared';

/**
 * DTO for creating a new level.
 */
export class CreateLevelDto implements CreateLevel {
  @ApiProperty({ example: 2, description: 'Unique identifier for the level' })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'Supporter', description: 'Name of the level' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'https://cdn.egofm.de/images/levels/supporter.png',
    description: 'URL to the level badge or icon',
  })
  @IsUrl()
  imageUrl: string;

  @ApiProperty({ example: 500, description: 'Minimum points required for this level' })
  @IsNumber()
  @Min(0)
  minPoints: number;

  @ApiPropertyOptional({
    example: 1499,
    description: 'Maximum points before the next level. Null means this is the highest level.',
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPoints?: number | null;
}
