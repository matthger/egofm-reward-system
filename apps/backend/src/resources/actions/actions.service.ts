import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Action } from './entities/action.entity';
import { ActionDetailsDto } from '../../common/dto/action/action-details.dto';
import { ActionInfoDto } from '../../common/dto/action/action-info.dto';

/**
 * Service for managing actions.
 */
@Injectable()
export class ActionsService {
  private readonly logger = new Logger(ActionsService.name);

  /**
   * Constructor for ActionsService.
   *
   * @param {Repository<Action>} actionRepository - Repository for Action entity.
   */
  constructor(
    @InjectRepository(Action)
    private readonly actionRepository: Repository<Action>,
  ) {}

  /**
   * Creates and saves a new action in the database.
   *
   * @param {CreateActionDto} createActionDto - Data for the new action.
   * @returns {Promise<ActionDetailsDto>} - The created action.
   */
  async create(createActionDto: CreateActionDto): Promise<ActionDetailsDto> {
    this.logger.log('Creating new action');
    try {
      const action: Action = this.actionRepository.create(createActionDto);
      const savedAction = await this.actionRepository.save(action);
      this.logger.log(`Action created with ID ${savedAction.id}`);
      return this.mapToActionDetailsDto(savedAction);
    } catch (error) {
      this.logger.error('Failed to create action', error.stack);
      throw error;
    }
  }

  /**
   * Retrieves all actions from the database.
   *
   * @param {boolean} activeOnly - true if only active actions should be returned, otherwise false
   * @returns {Promise<Array<ActionInfoDto>>} - List of all actions.
   */
  async findAll(activeOnly: boolean): Promise<Array<ActionInfoDto>> {
    this.logger.log(`Retrieving ${activeOnly ? 'active' : 'all'} actions`);

    try {
      const where = activeOnly ? { isActive: true } : {};

      const actions: Array<Action> = await this.actionRepository.find({ where });

      this.logger.log(`Retrieved ${actions.length} actions`);
      return actions.map((action: Action): ActionInfoDto => this.mapToActionInfoDto(action));
    } catch (error) {
      this.logger.error('Failed to retrieve actions', error.stack);
      throw error;
    }
  }

  /**
   * Retrieves a single action by ID.
   *
   * @param {string} id - UUID of the action.
   * @returns {Promise<ActionDetailsDto>} - The action entity.
   */
  async findOne(id: string): Promise<ActionDetailsDto> {
    this.logger.log(`Retrieving action with ID ${id}`);
    try {
      const action: Action = await this.findActionById(id);
      this.logger.log(`Retrieved action with ID ${id}`);
      return this.mapToActionDetailsDto(action);
    } catch (error) {
      this.logger.error(`Failed to retrieve action with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates an existing action by ID.
   *
   * @param {string} id - UUID of the action.
   * @param {UpdateActionDto} updateActionDto - Updated action data.
   * @returns {Promise<ActionDetailsDto>} - The updated action.
   */
  async update(id: string, updateActionDto: UpdateActionDto): Promise<ActionDetailsDto> {
    this.logger.log(`Updating action with ID ${id}`);
    try {
      const action: Action = await this.findActionById(id);
      Object.assign(action, updateActionDto);
      const updatedAction = await this.actionRepository.save(action);
      this.logger.log(`Action with ID ${id} updated`);
      return this.mapToActionDetailsDto(updatedAction);
    } catch (error) {
      this.logger.error(`Failed to update action with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Deletes an action by ID.
   *
   * @param {string} id - UUID of the action.
   * @returns {Promise<void>} - Resolves if deletion is successful.
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting action with ID ${id}`);
    try {
      const result: DeleteResult = await this.actionRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Action with ID ${id} not found for deletion`);
        throw new NotFoundException(`Action with ID ${id} not found`);
      }
      this.logger.log(`Action with ID ${id} deleted`);
    } catch (error) {
      this.logger.error(`Failed to delete action with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Finds an action by their ID.
   *
   * @param {string} id - The ID of the action to find.
   * @returns {Promise<Action>} - A promise that resolves to the action entity.
   */
  async findActionById(id: string): Promise<Action> {
    this.logger.log(`Finding action with ID ${id}`);
    try {
      const action: Action | null = await this.actionRepository.findOne({ where: { id } });
      if (!action) {
        this.logger.warn(`Action with ID ${id} not found`);
        throw new NotFoundException(`Action with ID ${id} not found`);
      }
      this.logger.log(`Action with ID ${id} found`);
      return action;
    } catch (error) {
      this.logger.error(`Failed to find action with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Maps a Action entity to a ActionInfoDto object.
   *
   * @param {Action} action - The action entity to map.
   * @returns {ActionInfoDto} - The mapped ActionInfoDto object.
   * @private
   */
  private mapToActionInfoDto(action: Action): ActionInfoDto {
    return {
      id: action.id,
      name: action.name,
      title: action.title,
      description: action.description,
      points: action.points,
    };
  }

  /**
   * Maps a Action entity to a ActionDetailsDto object.
   *
   * @param {Action} action - The action entity to map.
   * @returns {ActionDetailsDto} - The mapped ActionDetailsDto object.
   * @private
   */
  private mapToActionDetailsDto(action: Action): ActionDetailsDto {
    return {
      ...this.mapToActionInfoDto(action),
      interval: action.interval,
      maxPerDay: action.maxPerDay,
      requiresProof: action.requiresProof,
      isActive: action.isActive,
      createdAt: action.createdAt,
      updatedAt: action.updatedAt,
    };
  }
}
