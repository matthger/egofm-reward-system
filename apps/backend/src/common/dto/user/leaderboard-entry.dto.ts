import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

import { LeaderboardEntry } from '@egofm-reward/shared';

/**
 * Data transfer object representing a single leaderboard entry.
 */
export class LeaderboardEntryDto implements LeaderboardEntry {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'supporter' })
  username: string;

  @IsNumber()
  @ApiProperty({
    description: 'Current points collected by the user',
    example: 600,
    default: 0,
  })
  points: number;

  @IsNumber()
  @ApiProperty({
    description: 'Current rank of the user',
    example: 6,
  })
  rank: number;
}
