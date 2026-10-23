import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { actionLogSeeds } from './seed-data/action-log.seed';
import { actionSeeds } from './seed-data/action.seed';
import { levelSeeds } from './seed-data/level.seed';
import { rewardClaimSeeds } from './seed-data/reward-claim.seed';
import { rewardSeeds } from './seed-data/reward.seed';
import { userSeeds } from './seed-data/user.seed';
import { ActionLog } from '../resources/action-logs/entities/action-log.entity';
import { Action } from '../resources/actions/entities/action.entity';
import { Level } from '../resources/level/entities/level.entity';
import { RewardClaim } from '../resources/reward-claims/entities/reward-claim.entity';
import { Reward } from '../resources/rewards/entities/reward.entity';
import { User } from '../resources/users/entities/user.entity';

/**
 * Service for seeding the database with initial data.
 */
@Injectable()
export class SeederService implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(SeederService.name);

  /**
   * Constructor for the SeederService.
   *
   * @param {Repository<Level>} levelRepository - The repository for the Level entity.
   * @param {Repository<Action>} actionRepository - The repository for the Action entity.
   * @param {Repository<Reward>} rewardRepository - The repository for the Reward entity.
   * @param {Repository<User>} userRepository - The repository for the User entity.
   * @param {Repository<ActionLog>} actionLogRepository - The repository for the ActionLog entity.
   * @param {Repository<RewardClaim>} rewardClaimRepository - The repository for the RewardClaim entity.
   */
  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ActionLog)
    private readonly actionLogRepository: Repository<ActionLog>,
    @InjectRepository(RewardClaim)
    private readonly rewardClaimRepository: Repository<RewardClaim>,
  ) {}

  /**
   * Lifecycle hook that runs when the application is bootstrapped.
   */
  async onApplicationBootstrap(): Promise<void> {
    await this.seedLevels();
    await this.seedActions();
    await this.seedRewards();
    await this.seedUsers();
    await this.seedActionLogs();
    await this.seedRewardClaims();
  }

  /**
   * Seeds the levels into the database if they do not already exist.
   */
  private async seedLevels(): Promise<void> {
    const existing: number = await this.levelRepository.count();
    if (existing > 0) {
      this.logger.log('Levels already seeded.');
      return;
    }

    await this.levelRepository.save(levelSeeds);
    this.logger.log(`Seeded ${levelSeeds.length} levels.`);
  }

  /**
   * Seeds the actions into the database if they do not already exist.
   */
  private async seedActions(): Promise<void> {
    const existing: number = await this.actionRepository.count();
    if (existing > 0) {
      this.logger.log('Actions already seeded.');
      return;
    }

    await this.actionRepository.save(actionSeeds);
    this.logger.log(`Seeded ${actionSeeds.length} actions.`);
  }

  /**
   * Seeds the rewards into the database if they do not already exist.
   */
  private async seedRewards(): Promise<void> {
    if (await this.rewardRepository.count()) {
      this.logger.log('Rewards already seeded.');
      return;
    }

    const levels: Array<Level> = await this.levelRepository.find();

    const rewardsToSeed: Array<Partial<Reward>> = rewardSeeds(levels);

    await this.rewardRepository.save(rewardsToSeed);
    this.logger.log(`Seeded ${rewardsToSeed.length} rewards.`);
  }

  /**
   * Seeds the users into the database if they do not already exist.
   */
  private async seedUsers(): Promise<void> {
    if (await this.userRepository.count()) {
      this.logger.log('Users already seeded.');
      return;
    }

    const levels: Array<Level> = await this.levelRepository.find();
    const usersToSeed: Array<Partial<User>> = await userSeeds(levels);
    await this.userRepository.save(usersToSeed);

    this.logger.log(`Seeded ${usersToSeed.length} users.`);
  }

  /**
   * Seeds the action logs into the database if they do not already exist.
   */
  private async seedActionLogs(): Promise<void> {
    if (await this.actionLogRepository.count()) {
      this.logger.log('Action logs already seeded.');
      return;
    }

    const users: Array<User> = await this.userRepository.find({ relations: ['level'] });
    const actions: Array<Action> = await this.actionRepository.find();
    const actionLogsToSeed: Array<Partial<ActionLog>> = actionLogSeeds(users, actions);
    await this.actionLogRepository.save(actionLogsToSeed);

    this.logger.log(`Seeded ${actionLogsToSeed.length} action logs.`);
  }

  /**
   * Seeds the reward claims into the database if they do not already exist.
   */
  private async seedRewardClaims(): Promise<void> {
    if (await this.rewardClaimRepository.count()) {
      this.logger.log('Reward claims already seeded.');
      return;
    }

    const users: Array<User> = await this.userRepository.find({ relations: ['level'] });
    const rewards: Array<Reward> = await this.rewardRepository.find();
    const levels: Array<Level> = await this.levelRepository.find();
    const rewardClaimsToSeed: Array<Partial<RewardClaim>> = rewardClaimSeeds(
      levels,
      users,
      rewards,
    );
    await this.rewardClaimRepository.save(rewardClaimsToSeed);

    this.logger.log(`Seeded ${rewardClaimsToSeed.length} reward claims.`);
  }
}
