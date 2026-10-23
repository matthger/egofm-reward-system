import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { ActionLogStatus } from '@egofm-reward/shared';

import { CreateActionLogDto } from './dto/create-action-log.dto';
import { UpdateActionLogDto } from './dto/update-action-log.dto';
import { ActionLog } from './entities/action-log.entity';
import { ActionLogDetailsDto } from '../../common/dto/action-log/action-log-details.dto';
import { ActionLogInfoDto } from '../../common/dto/action-log/action-log-info.dto';
import { LevelDetailsDto } from '../../common/dto/level/level-details.dto';
import { ActionsService } from '../actions/actions.service';
import { Action } from '../actions/entities/action.entity';
import { Level } from '../level/entities/level.entity';
import { LevelService } from '../level/level.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

/**
 * Service for managing action logs.
 */
@Injectable()
export class ActionLogsService {
  private readonly logger = new Logger(ActionLogsService.name);

  /**
   * Constructor for ActionLogsService.
   *
   * @param {Repository<ActionLog>} actionLogRepository - Repository for ActionLog entity.
   * @param {ActionsService} actionsService - The actions service.
   * @param {UsersService} usersService - The service to handle user operations.
   * @param {LevelService} levelService - The service responsible for level operations.
   */
  constructor(
    @InjectRepository(ActionLog)
    private readonly actionLogRepository: Repository<ActionLog>,
    private readonly actionsService: ActionsService,
    private readonly usersService: UsersService,
    private readonly levelService: LevelService,
  ) {}

  /**
   * Creates a new action log entry.
   *
   * @param {CreateActionLogDto} createActionLogDto - DTO with data to create a new action log.
   * @returns {Promise<ActionLogDetailsDto>} - The created action log entity.
   */
  async create(createActionLogDto: CreateActionLogDto): Promise<ActionLogDetailsDto> {
    this.logger.log(`Creating action log: ${JSON.stringify(createActionLogDto)}`);

    try {
      const action: Action = await this.actionsService.findActionById(createActionLogDto.actionId);
      const user: User = await this.usersService.findUserById(createActionLogDto.userId);

      if (!action) {
        const errorMessage = `Action with ID ${createActionLogDto.actionId} not found`;
        this.logger.warn(errorMessage);
        throw new Error(errorMessage);
      }

      const actionLog: ActionLog = this.actionLogRepository.create({
        action,
        user,
        metadata: createActionLogDto.metadata ? createActionLogDto.metadata : {},
        status: ActionLogStatus.CLAIMABLE,
      });
      const savedActionLog: ActionLog = await this.actionLogRepository.save(actionLog);
      this.logger.log(`Action log created with ID ${savedActionLog.id}`);

      return this.mapToActionLogDetailsDto(savedActionLog);
    } catch (error) {
      this.logger.error('Failed to create action log', error.stack);
      throw error;
    }
  }

  /**
   * Retrieves all action log entries.
   *
   * @returns {Promise<Array<ActionLogInfoDto>>} - Array of all action log entities.
   */
  async findAll(): Promise<Array<ActionLogInfoDto>> {
    this.logger.log('Fetching all action logs');
    try {
      const actionLogs: Array<ActionLog> = await this.actionLogRepository.find({
        relations: ['user', 'action'],
      });
      this.logger.log(`Retrieved ${actionLogs.length} action logs`);
      return actionLogs.map(
        (actionLog: ActionLog): ActionLogInfoDto => this.mapToActionLogInfoDto(actionLog),
      );
    } catch (error) {
      this.logger.error('Failed to fetch all action logs', error.stack);
      throw error;
    }
  }

  /**
   * Retrieves an action log by its ID.
   *
   * @param {string} id - UUID of the action log.
   * @returns {Promise<ActionLogDetailsDto>} - The found action log entity.
   */
  async findOne(id: string): Promise<ActionLogDetailsDto> {
    this.logger.log(`Retrieving action log with ID ${id}`);
    try {
      const actionLog: ActionLog = await this.findActionLogById(id);
      this.logger.log(`Retrieved action log with ID ${actionLog.id}`);
      return this.mapToActionLogDetailsDto(actionLog);
    } catch (error) {
      this.logger.error(`Failed to retrieve action log with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Updates an existing action log.
   *
   * @param {string} id - UUID of the action log to update.
   * @param {UpdateActionLogDto} updateActionLogDto - DTO containing updated fields.
   * @returns {Promise<ActionLogDetailsDto & { leveledUp: boolean; newLevel?: LevelDetailsDto }>} - The updated action log entity.
   */
  async update(
    id: string,
    updateActionLogDto: UpdateActionLogDto,
  ): Promise<ActionLogDetailsDto & { leveledUp: boolean; newLevel?: LevelDetailsDto }> {
    this.logger.log(`Updating action log with ID ${id}`);

    try {
      const actionLog = await this.findActionLogById(id);
      const previousStatus = actionLog.status;

      const actionId = updateActionLogDto.actionId ?? actionLog.action.id;
      const action = await this.actionsService.findActionById(actionId);

      Object.assign(actionLog, updateActionLogDto);
      const savedActionLog = await this.actionLogRepository.save(actionLog);
      this.logger.log(`Action log with ID ${id} updated`);

      let leveledUp = false;
      let newLevel: Level | undefined;

      const nowClaimed =
        previousStatus === ActionLogStatus.CLAIMABLE &&
        savedActionLog.status === ActionLogStatus.CLAIMED;

      if (nowClaimed) {
        this.logger.log(
          `Adding ${action.points} points to user ${savedActionLog.user.id} for action "${action.title}"`,
        );

        const addPointsResult = await this.usersService.addPoints(
          savedActionLog.user.id,
          action.points,
        );

        leveledUp = addPointsResult.leveledUp;
        newLevel = addPointsResult.newLevel;
      }

      const dto = this.mapToActionLogDetailsDto(savedActionLog);

      return {
        ...dto,
        leveledUp,
        ...(leveledUp &&
          newLevel && {
            newLevel: this.levelService.mapToLevelDetailsDto(newLevel),
          }),
      };
    } catch (error) {
      this.logger.error(`Failed to update action log with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Deletes an action log by its ID.
   *
   * @param {string} id - UUID of the action log to delete.
   * @returns {Promise<void>} - Resolves when deletion is complete.
   */
  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting action log with ID ${id}`);
    try {
      const deleteResult: DeleteResult = await this.actionLogRepository.delete(id);
      if (deleteResult.affected === 0) {
        this.logger.warn(`Action log with ID ${id} not found for deletion`);
        throw new NotFoundException(`ActionLog with ID ${id} not found`);
      }
      this.logger.log(`Action log with ID ${id} deleted`);
    } catch (error) {
      this.logger.error(`Failed to delete action log with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Finds an action log by their ID.
   *
   * @param {string} id - The ID of the action log to find.
   * @returns {Promise<ActionLog>} - A promise that resolves to the action log entity.
   * @private
   */
  private async findActionLogById(id: string): Promise<ActionLog> {
    this.logger.log(`Finding action log with ID ${id}`);
    try {
      const actionLog: ActionLog | null = await this.actionLogRepository.findOne({
        relations: ['user', 'action'],
        where: { id },
      });
      if (!actionLog) {
        this.logger.warn(`Action log with ID ${id} not found`);
        throw new NotFoundException(`Action log with ID ${id} not found`);
      }
      return actionLog;
    } catch (error) {
      this.logger.error(`Failed to find action log with ID ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Maps a ActionLog entity to a ActionInfoDto object.
   *
   * @param {ActionLog} actionLog - The action entity to map.
   * @returns {ActionLogInfoDto} - The mapped ActionInfoDto object.
   * @private
   */
  private mapToActionLogInfoDto(actionLog: ActionLog): ActionLogInfoDto {
    return {
      id: actionLog.id,
      userId: actionLog.user.id,
      actionId: actionLog.action.id,
    };
  }

  /**
   * Maps a ActionLog entity to a ActionDetailsDto object.
   *
   * @param {ActionLog} actionLog - The action log entity to map.
   * @returns {ActionLogDetailsDto} - The mapped ActionLogDetailsDto object.
   * @private
   */
  private mapToActionLogDetailsDto(actionLog: ActionLog): ActionLogDetailsDto {
    return {
      ...this.mapToActionLogInfoDto(actionLog),
      createdAt: actionLog.createdAt,
      metadata: actionLog.metadata,
      status: actionLog.status,
    };
  }
}
