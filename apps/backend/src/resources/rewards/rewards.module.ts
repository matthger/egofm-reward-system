import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reward } from './entities/reward.entity';
import { RewardsController } from './rewards.controller';
import { RewardsService } from './rewards.service';
import { Level } from '../level/entities/level.entity';

/**
 * RewardsModule is responsible for managing rewards-related functionality.
 */
@Module({
  imports: [TypeOrmModule.forFeature([Level, Reward])],
  controllers: [RewardsController],
  providers: [RewardsService],
  exports: [RewardsService],
})
export class RewardsModule {}
