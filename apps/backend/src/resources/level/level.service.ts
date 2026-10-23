import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { Level } from './entities/level.entity';
import { LevelDetailsDto } from '../../common/dto/level/level-details.dto';
import { LevelInfoDto } from '../../common/dto/level/level-info.dto';
import { LevelWithRewardsDto } from '../../common/dto/level/level-with-rewards.dto';
import { RewardDetailsDto } from '../../common/dto/reward/reward-details.dto';
import { Reward } from '../rewards/entities/reward.entity';

/**
 * Service for managing user levels in the system.
 */
@Injectable()
export class LevelService {
  private readonly logger = new Logger(LevelService.name);

  /**
   * Constructor for LevelService.
   *
   * @param {Repository<Level>} levelRepository - The repository for Level entities.
   */
  constructor(
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}

  /**
   * Creates a new level.
   *
   * @param {CreateLevelDto} createLevelDto - DTO with level creation data.
   * @returns {Promise<LevelDetailsDto>} - The created level.
   */
  async create(createLevelDto: CreateLevelDto): Promise<LevelDetailsDto> {
    this.logger.log(`Creating new level: ${JSON.stringify(createLevelDto)}`);
    try {
      const level: Level = this.levelRepository.create(createLevelDto);
      const savedLevel = await this.levelRepository.save(level);
      this.logger.log(`Created level with ID ${savedLevel.id}`);
      return this.mapToLevelDetailsDto(savedLevel);
    } catch (error) {
      this.logger.error('Failed to create level', error.stack);
      throw error;
    }
  }

  /**
   * Returns all levels.
   *
   * @returns {Promise<Array<LevelInfoDto>>} - A list of all levels ordered by their ids.
   */
  async findAll(): Promise<Array<LevelInfoDto>> {
    this.logger.log('Retrieving all levels');
    try {
      const levels: Array<Level> = await this.levelRepository.find({ order: { id: 'ASC' } });
      this.logger.log(`Retrieved ${levels.length} levels`);
      return levels.map((level: Level): LevelInfoDto => this.mapToLevelInfoDto(level));
    } catch (error) {
      this.logger.error('Failed to retrieve levels', error.stack);
      throw error;
    }
  }

  /**
   * Finds a level by ID.
   *
   * @param {string} id - The ID of the level to find.
   * @returns {Promise<LevelDetailsDto>} - A promise that resolves to the level entity.
   */
  async findOne(id: string): Promise<LevelDetailsDto> {
    this.logger.log(`Finding level with ID ${id}`);
    try {
      const level: Level = await this.findLevelById(id);
      this.logger.log(`Retrieved level with ID ${id}`);
      return this.mapToLevelDetailsDto(level);
    } catch (error) {
      this.logger.error(`Failed to retrieve level with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates a level by ID.
   *
   * @param {string} id - The ID of the level to update.
   * @param {UpdateLevelDto} updateLevelDto - The data transfer object containing the updated level details.
   * @returns {Promise<LevelDetailsDto>} - A promise that resolves to the updated level entity.
   */
  async update(id: string, updateLevelDto: UpdateLevelDto): Promise<LevelDetailsDto> {
    this.logger.log(`Updating level with ID ${id}`);
    try {
      const level: Level = await this.findLevelById(id);
      Object.assign(level, updateLevelDto);
      const updatedLevel = await this.levelRepository.save(level);
      this.logger.log(`Level with ID ${id} updated`);
      return this.mapToLevelDetailsDto(updatedLevel);
    } catch (error) {
      this.logger.error(`Failed to update level with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Removes a level by ID.
   *
   * @param {string} id - The ID of the level to remove.
   * @returns {Promise<void>} - A promise that resolves when the level is removed.
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting level with ID ${id}`);
    try {
      const result: DeleteResult = await this.levelRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Level with ID ${id} not found for deletion`);
        throw new NotFoundException(`Level with id ${id} not found`);
      }
      this.logger.log(`Deleted level with ID ${id}`);
    } catch (error) {
      this.logger.error(`Failed to delete level with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Finds all rewards for a specific level.
   *
   * @param {string} levelId - The ID of the level for which to find rewards.
   * @returns {Promise<LevelWithRewardsDto>} - A promise that resolves to the level with its rewards.
   */
  async findAllRewards(levelId: string): Promise<LevelWithRewardsDto> {
    this.logger.log(`Retrieving rewards for level ID ${levelId}`);
    try {
      const levelEntity: Level = await this.findLevelById(levelId);
      this.logger.log(`Retrieved rewards for level ID ${levelId}`);
      return {
        ...this.mapToLevelInfoDto(levelEntity),
        rewards: levelEntity.rewards.map(
          (reward: Reward): RewardDetailsDto => ({
            id: reward.id,
            levelId: reward.level?.id,
            name: reward.name,
            title: reward.title,
            description: reward.description,
            imageUrl: reward.imageUrl,
            isActive: reward.isActive,
            isAutomated: reward.isAutomated,
          }),
        ),
      };
    } catch (error) {
      this.logger.error(`Failed to retrieve rewards for level ID ${levelId}`, error.stack);
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
  async findLevelById(id: string): Promise<Level> {
    this.logger.log(`Finding level by ID ${id}`);
    try {
      const idAsNumber: number = parseInt(id, 10);
      if (isNaN(idAsNumber)) {
        this.logger.warn(`Invalid level ID format: ${id}`);
        throw new NotFoundException(`Level with ID ${id} not found`);
      }

      const level: Level | null = await this.levelRepository.findOne({
        relations: ['rewards'],
        where: { id: idAsNumber },
      });
      if (!level) {
        this.logger.warn(`Level with ID ${id} not found`);
        throw new NotFoundException(`Level with ID ${id} not found`);
      }
      return level;
    } catch (error) {
      this.logger.error(`Failed to find level with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Maps a Level entity to a LevelInfoDto object.
   *
   * @param {Level} level - The level entity to map.
   * @returns {LevelInfoDto} - The mapped LevelInfoDto object.
   * @private
   */
  private mapToLevelInfoDto(level: Level): LevelInfoDto {
    return {
      id: level.id,
      name: level.name,
      minPoints: level.minPoints,
      maxPoints: level.maxPoints,
      imageUrl: level.imageUrl,
    };
  }

  /**
   * Maps a Level entity to a UserDetailsDto object.
   *
   * @param {Level} level - The level entity to map.
   * @returns {LevelDetailsDto} - The mapped LevelDetailsDto object.
   * @private
   */
  mapToLevelDetailsDto(level: Level): LevelDetailsDto {
    return {
      ...this.mapToLevelInfoDto(level),
    };
  }
}
