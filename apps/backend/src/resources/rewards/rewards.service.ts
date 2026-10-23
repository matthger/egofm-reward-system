import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { Reward } from './entities/reward.entity';
import { RewardDetailsDto } from '../../common/dto/reward/reward-details.dto';
import { RewardInfoDto } from '../../common/dto/reward/reward-info.dto';
import { Level } from '../level/entities/level.entity';

/**
 * Service for managing rewards.
 */
@Injectable()
export class RewardsService {
  private readonly logger = new Logger(RewardsService.name);

  /**
   * Constructor for RewardsService.
   *
   * @param {Repository<Reward>} rewardRepository - Repository for handling reward entities.
   * @param {Repository<Level>} levelRepository - Repository for handling level entities.
   */
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}

  /**
   * Creates a new reward and saves it to the database.
   *
   * @param {CreateRewardDto} createRewardDto - Data transfer object containing reward details.
   * @returns {Promise<RewardDetailsDto>} The created reward as a details DTO.
   */
  async create(createRewardDto: CreateRewardDto): Promise<RewardDetailsDto> {
    this.logger.log(`Creating new reward: ${JSON.stringify(createRewardDto)}`);
    try {
      const level: Level = await this.findLevelById(createRewardDto.levelId);

      const reward: Reward = this.rewardRepository.create({
        ...createRewardDto,
        level,
      });

      const savedReward: Reward = await this.rewardRepository.save(reward);
      this.logger.log(`Reward created with ID ${savedReward.id}`);
      return this.mapToRewardDetailsDto(savedReward);
    } catch (error) {
      this.logger.error('Failed to create reward', error.stack);
      throw error;
    }
  }

  /**
   * Retrieves all rewards.
   *
   * @param {boolean} activeOnly - true if only active rewards should be returned, otherwise false
   * @returns {Promise<Array<RewardInfoDto>>} A list of reward information DTOs.
   */
  async findAll(activeOnly: boolean): Promise<Array<RewardInfoDto>> {
    this.logger.log(`Retrieving ${activeOnly ? 'active' : 'all'} rewards`);

    try {
      const where = activeOnly ? { isActive: true } : {};

      const rewards: Array<Reward> = await this.rewardRepository.find({
        relations: ['level'],
        where,
      });

      this.logger.log(`Retrieved ${rewards.length} rewards`);
      return rewards.map((reward: Reward): RewardInfoDto => this.mapToRewardInfoDto(reward));
    } catch (error) {
      this.logger.error('Failed to retrieve rewards', error.stack);
      throw error;
    }
  }

  /**
   * Retrieves a reward by ID.
   *
   * @param {string} id - The UUID of the reward to retrieve.
   * @returns {Promise<RewardDetailsDto>} The details of the requested reward.
   */
  async findOne(id: string): Promise<RewardDetailsDto> {
    this.logger.log(`Retrieving reward with ID ${id}`);
    try {
      const reward: Reward = await this.findRewardById(id);
      this.logger.log(`Retrieved reward with ID ${id}`);
      return this.mapToRewardDetailsDto(reward);
    } catch (error) {
      this.logger.error(`Failed to retrieve reward with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates an existing reward.
   *
   * @param {string} id - The UUID of the reward to update.
   * @param {UpdateRewardDto} dto - Data transfer object containing updated reward details.
   * @returns {Promise<RewardDetailsDto>} The updated reward as a details DTO.
   */
  async update(id: string, dto: UpdateRewardDto): Promise<RewardDetailsDto> {
    this.logger.log(`Updating reward with ID ${id}`);
    try {
      const reward: Reward = await this.findRewardById(id);

      if (dto.levelId && dto.levelId !== reward.level.id) {
        reward.level = await this.findLevelById(dto.levelId);
      }

      Object.assign(reward, dto);
      const updatedReward: Reward = await this.rewardRepository.save(reward);
      this.logger.log(`Reward with ID ${id} updated`);
      return this.mapToRewardDetailsDto(updatedReward);
    } catch (error) {
      this.logger.error(`Failed to update reward with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Deletes a reward by ID.
   *
   * @param {string} id - The UUID of the reward to delete.
   * @returns {Promise<void>} Resolves when the reward is successfully deleted.
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting reward with ID ${id}`);
    try {
      const result: DeleteResult = await this.rewardRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Reward with ID ${id} not found for deletion`);
        throw new NotFoundException(`Reward with ID ${id} not found`);
      }
      this.logger.log(`Reward with ID ${id} deleted`);
    } catch (error) {
      this.logger.error(`Failed to delete reward with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Finds a level by their ID.
   *
   * @param {string} id - The ID of the level to find.
   * @returns {Promise<Level>} - A promise that resolves to the level entity.
   * @private
   */
  private async findLevelById(id: number): Promise<Level> {
    this.logger.log(`Finding level by ID ${id}`);
    try {
      const level: Level | null = await this.levelRepository.findOne({ where: { id } });
      if (!level) {
        this.logger.warn(`Level with ID ${id} not found`);
        throw new NotFoundException(`Level with ID ${id} not found`);
      }
      this.logger.log(`Level with ID ${id} found`);
      return level;
    } catch (error) {
      this.logger.error(`Failed to find level with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Finds a reward by ID and throws if not found.
   *
   * @param {string} id - The UUID of the reward to find.
   * @returns {Promise<Reward>} The found reward entity.
   * @private
   */
  async findRewardById(id: string): Promise<Reward> {
    this.logger.log(`Finding reward by id ${id}`);
    const reward: Reward | null = await this.rewardRepository.findOne({
      where: { id },
      relations: ['level'],
    });
    if (!reward) {
      this.logger.warn(`Reward with ID ${id} not found`);
      throw new NotFoundException(`Reward with ID ${id} not found`);
    }
    this.logger.log(`Reward with ID ${id} found`);
    return reward;
  }

  /**
   * Maps a reward entity to a RewardInfoDto.
   *
   * @param {Reward} reward The reward entity.
   * @returns {RewardInfoDto} The reward information DTO.
   * @private
   */
  private mapToRewardInfoDto(reward: Reward): RewardInfoDto {
    return {
      id: reward.id,
      levelId: reward.level?.id,
      name: reward.name,
      title: reward.title,
      description: reward.description,
      imageUrl: reward.imageUrl,
    };
  }

  /**
   * Maps a reward entity to a RewardDetailsDto.
   *
   * @param {Reward} reward The reward entity.
   * @returns {RewardDetailsDto} The reward details DTO.
   * @private
   */
  private mapToRewardDetailsDto(reward: Reward): RewardDetailsDto {
    return {
      ...this.mapToRewardInfoDto(reward),
      isActive: reward.isActive,
      isAutomated: reward.isAutomated,
    };
  }
}
