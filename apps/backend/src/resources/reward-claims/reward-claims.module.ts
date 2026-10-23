import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RewardClaim } from './entities/reward-claim.entity';
import { RewardClaimsController } from './reward-claims.controller';
import { RewardClaimsService } from './reward-claims.service';
import { LevelModule } from '../level/level.module';
import { RewardsModule } from '../rewards/rewards.module';
import { UsersModule } from '../users/users.module';

/**
 * Module for handling reward claims.
 */
@Module({
  imports: [TypeOrmModule.forFeature([RewardClaim]), RewardsModule, UsersModule, LevelModule],
  controllers: [RewardClaimsController],
  providers: [RewardClaimsService],
})
export class RewardClaimsModule {}
