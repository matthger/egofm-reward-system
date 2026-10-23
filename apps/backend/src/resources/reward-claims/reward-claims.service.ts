import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { RewardClaimStatus } from '@egofm-reward/shared';

import { CreateRewardClaimDto } from './dto/create-reward-claim.dto';
import { UpdateRewardClaimDto } from './dto/update-reward-claim.dto';
import { RewardClaim } from './entities/reward-claim.entity';
import { RewardClaimInfoDto } from '../../common/dto/reward-claim/reward-claim-info.dto';
import { LevelService } from '../level/level.service';
import { RewardsService } from '../rewards/rewards.service';
import { UsersService } from '../users/users.service';

/**
 * Service for reward claim logic and database operations.
 */
@Injectable()
export class RewardClaimsService {
  private readonly logger = new Logger(RewardClaimsService.name);

  /**
   * Constructor for RewardClaimsService.
   *
   * @param {Repository<RewardClaim>} rewardClaimRepository Repository for interacting with reward claims.
   * @param {RewardsService} rewardsService - Service for handling reward operations
   * @param {UsersService} usersService - The service to handle user operations.
   * @param {LevelService} levelsService - The service responsible for level operations.
   */
  constructor(
    @InjectRepository(RewardClaim)
    private readonly rewardClaimRepository: Repository<RewardClaim>,
    private readonly rewardsService: RewardsService,
    private readonly usersService: UsersService,
    private readonly levelsService: LevelService,
  ) {}

  /**
   * Creates a new reward claim.
   *
   * @param {CreateRewardClaimDto} createRewardClaimDto The data for the new reward claim.
   * @returns {Promise<RewardClaimInfoDto>} The created reward claim.
   */
  async create(createRewardClaimDto: CreateRewardClaimDto): Promise<RewardClaimInfoDto> {
    this.logger.log(`Creating new reward claim: ${JSON.stringify(createRewardClaimDto)}`);

    try {
      const reward = await this.rewardsService.findRewardById(createRewardClaimDto.rewardId);
      const user = await this.usersService.findUserById(createRewardClaimDto.userId);
      const level = createRewardClaimDto.levelId
        ? await this.levelsService.findLevelById(createRewardClaimDto.levelId)
        : user.level;

      if (!reward) {
        const errorMessage = `Reward with ID ${createRewardClaimDto.rewardId} not found`;
        this.logger.warn(errorMessage);
        throw new Error(errorMessage);
      }

      this.logger.log(`Creating claim for reward "${reward.title}" for user ${user.username}`);

      const rewardClaim: RewardClaim = this.rewardClaimRepository.create({
        reward,
        user,
        level,
        status: createRewardClaimDto.status ?? RewardClaimStatus.PENDING,
        claimedAt: new Date(),
      });

      const savedClaim = await this.rewardClaimRepository.save(rewardClaim);
      this.logger.log(`Reward claim created with ID ${savedClaim.id}`);

      return this.mapToRewardClaimInfoDto(savedClaim);
    } catch (error) {
      this.logger.error('Failed to create reward claim', error.stack);
      throw error;
    }
  }

  /**
   * Retrieves all reward claims.
   *
   * @returns {Promise<Array<RewardClaimInfoDto>>} List of reward claims.
   */
  async findAll(): Promise<Array<RewardClaimInfoDto>> {
    this.logger.log('Retrieving all reward claims');
    try {
      const rewardClaims: Array<RewardClaim> = await this.rewardClaimRepository.find({
        relations: ['user', 'reward'],
      });
      this.logger.log(`Retrieved ${rewardClaims.length} reward claims`);
      return rewardClaims.map(
        (claim: RewardClaim): RewardClaimInfoDto => this.mapToRewardClaimInfoDto(claim),
      );
    } catch (error) {
      this.logger.error('Failed to retrieve reward claims', error.stack);
      throw error;
    }
  }

  /**
   * Retrieves a single reward claim by ID.
   *
   * @param {string} id UUID of the reward claim.
   * @returns {Promise<RewardClaimInfoDto>} The matching reward claim.
   */
  async findOne(id: string): Promise<RewardClaimInfoDto> {
    this.logger.log(`Retrieving reward claim with ID ${id}`);
    try {
      const rewardClaim: RewardClaim = await this.findRewardClaimById(id);
      this.logger.log(`Retrieved reward claim with ID ${id}`);
      return this.mapToRewardClaimInfoDto(rewardClaim);
    } catch (error) {
      this.logger.error(`Error retrieving reward claim with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates a reward claim by ID.
   *
   * @param {string} id UUID of the reward claim.
   * @param {UpdateRewardClaimDto} updateRewardClaimDto DTO with the fields to update.
   * @returns {Promise<RewardClaimInfoDto>} The updated reward claim.
   */
  async update(
    id: string,
    updateRewardClaimDto: UpdateRewardClaimDto,
  ): Promise<RewardClaimInfoDto> {
    this.logger.log(`Updating reward claim with ID ${id}`);
    try {
      const rewardClaim: RewardClaim = await this.findRewardClaimById(id);
      Object.assign(rewardClaim, updateRewardClaimDto);
      const updatedRewardClaim = await this.rewardClaimRepository.save(rewardClaim);
      this.logger.log(`Reward claim with id ${id} updated`);
      return this.mapToRewardClaimInfoDto(updatedRewardClaim);
    } catch (error) {
      this.logger.error(`Failed to update reward claim with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Deletes a reward claim by ID.
   *
   * @param {string} id UUID of the reward claim.
   * @returns {Promise<void>} No return value.
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting reward claim with ID ${id}`);
    try {
      const result: DeleteResult = await this.rewardClaimRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`RewardClaim with ID ${id} not found for deletion`);
        throw new NotFoundException(`RewardClaim with ID ${id} not found`);
      }
      this.logger.log(`Reward claim with ID ${id} deleted`);
    } catch (error) {
      this.logger.error(`Failed to delete reward claim with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Finds a reward claim by its ID.
   *
   * @param {string} id The ID of the reward claim to find.
   * @returns {Promise<RewardClaim>} The found reward claim entity.
   * @private
   */
  private async findRewardClaimById(id: string): Promise<RewardClaim> {
    this.logger.log(`Finding reward claim by ID ${id}`);
    const rewardClaim: RewardClaim | null = await this.rewardClaimRepository.findOne({
      relations: ['user', 'reward'],
      where: { id },
    });
    if (!rewardClaim) {
      this.logger.warn(`RewardClaim with ID ${id} not found`);
      throw new NotFoundException(`RewardClaim with ID ${id} not found`);
    }
    this.logger.log(`RewardClaim with ID ${id} found`);
    return rewardClaim;
  }

  /**
   * Maps an entity to an info DTO.
   *
   * @param {RewardClaim} claim The reward claim entity.
   * @returns {RewardClaimInfoDto} The mapped DTO.
   * @private
   */
  private mapToRewardClaimInfoDto(claim: RewardClaim): RewardClaimInfoDto {
    return {
      id: claim.id,
      userId: claim.user.id,
      rewardId: claim.reward.id,
      claimedAt: claim.claimedAt,
      status: claim.status,
      levelId: claim.level.id,
    };
  }
}
