import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Role, ValidateResponse } from '@egofm-reward/shared';

import { ActionLogsService } from './action-logs.service';
import { CreateActionLogDto } from './dto/create-action-log.dto';
import { UpdateActionLogDto } from './dto/update-action-log.dto';
import { RequestUser } from '../../auth/decorator/request-user.decorator';
import { Roles } from '../../auth/decorator/roles.decorator';
import { ActionLogDetailsDto } from '../../common/dto/action-log/action-log-details.dto';
import { ActionLogInfoDto } from '../../common/dto/action-log/action-log-info.dto';
import { LevelDetailsDto } from '../../common/dto/level/level-details.dto';

/**
 * ActionLogsController handles requests related to action logs.
 */
@ApiTags('Action Logs')
@Controller('action-logs')
export class ActionLogsController {
  /**
   * Constructor for ActionLogsController.
   *
   * @param {ActionLogsService} actionLogsService - The service to handle action log operations.
   */
  constructor(private readonly actionLogsService: ActionLogsService) {}

  /**
   * Creates a new action log entry.
   *
   * @param {ValidateResponse} user - The user making the request, used for authorization.
   * @param {CreateActionLogDto} createActionLogDto - The data transfer object containing action log creation details.
   * @returns {Promise<ActionLogDetailsDto>} - A promise that resolves to the created action log.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new action log entry' })
  @ApiBody({ type: CreateActionLogDto })
  @ApiResponse({
    status: 201,
    description: 'The action log has been successfully created.',
    type: ActionLogDetailsDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth('access-token')
  create(
    @RequestUser() user: ValidateResponse,
    @Body() createActionLogDto: CreateActionLogDto,
  ): Promise<ActionLogDetailsDto> {
    // If the user is not an admin, they can only create logs for themselves
    if (user.role !== Role.ADMIN && user.userId !== createActionLogDto.userId) {
      throw new ForbiddenException('Forbidden resource');
    }

    return this.actionLogsService.create(createActionLogDto);
  }

  /**
   * Retrieves all action logs.
   *
   * @returns {Promise<Array<ActionLogInfoDto>>} - A promise that resolves to an array of action logs.
   */
  @Get()
  @ApiOperation({ summary: 'Get all action logs' })
  @ApiResponse({ status: 200, description: 'List of all action logs.', type: [ActionLogInfoDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  findAll(): Promise<Array<ActionLogInfoDto>> {
    return this.actionLogsService.findAll();
  }

  /**
   * Retrieves a specific action log by ID.
   *
   * @param {string} id - The UUID of the action log to retrieve.
   * @returns {Promise<ActionLogDetailsDto>} - A promise that resolves to the action log with the given ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get an action log by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the action log' })
  @ApiResponse({
    status: 200,
    description: 'The action log with the given ID.',
    type: ActionLogDetailsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Action log not found' })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string): Promise<ActionLogDetailsDto> {
    return this.actionLogsService.findOne(id);
  }

  /**
   * Updates a specific action log by ID.
   *
   * @param {ValidateResponse} user - The user making the request, used for authorization.
   * @param {string} id - The UUID of the action log to update.
   * @param {UpdateActionLogDto} updateActionLogDto - The DTO with fields to update.
   * @returns {Promise<ActionLogDetailsDto & { leveledUp: boolean; newLevel?: LevelDetailsDto }>} - A promise that resolves to the updated action log.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update an action log by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the action log' })
  @ApiBody({ type: UpdateActionLogDto })
  @ApiResponse({ status: 200, description: 'The updated action log.', type: ActionLogDetailsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Action log not found' })
  @ApiBearerAuth('access-token')
  update(
    @RequestUser() user: ValidateResponse,
    @Param('id') id: string,
    @Body() updateActionLogDto: UpdateActionLogDto,
  ): Promise<ActionLogDetailsDto & { leveledUp: boolean; newLevel?: LevelDetailsDto }> {
    // If the user is not an admin, they can only update logs for themselves
    if (user.role !== Role.ADMIN && user.userId !== updateActionLogDto.userId) {
      throw new ForbiddenException('Forbidden resource');
    }

    return this.actionLogsService.update(id, updateActionLogDto);
  }

  /**
   * Deletes a specific action log by ID.
   *
   * @param {string} id - The UUID of the action log to delete.
   * @returns {Promise<void>} - A promise that resolves when the action log is deleted.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an action log by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the action log' })
  @ApiResponse({ status: 204, description: 'The action log has been successfully deleted.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Action log not found' })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.actionLogsService.remove(id);
  }
}
