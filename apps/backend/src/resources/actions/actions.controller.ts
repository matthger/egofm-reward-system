import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { Role } from '@egofm-reward/shared';

import { ActionsService } from './actions.service';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import { Roles } from '../../auth/decorator/roles.decorator';
import { ActionDetailsDto } from '../../common/dto/action/action-details.dto';
import { ActionInfoDto } from '../../common/dto/action/action-info.dto';

/**
 * Controller to manage actions.
 */
@ApiTags('Actions')
@Controller('actions')
export class ActionsController {
  /**
   * Constructor for ActionsController.
   *
   * @param {ActionsService} actionsService - The actions service.
   */
  constructor(private readonly actionsService: ActionsService) {}

  /**
   * Creates a new action.
   *
   * @param {CreateActionDto} createActionDto - Data for the new action.
   * @returns {Promise<ActionDetailsDto>} - The newly created action.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new action' })
  @ApiBody({ type: CreateActionDto })
  @ApiResponse({ status: 201, description: 'Action created successfully.', type: ActionDetailsDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  create(@Body() createActionDto: CreateActionDto): Promise<ActionDetailsDto> {
    return this.actionsService.create(createActionDto);
  }

  /**
   * Retrieves all actions.
   *
   * @param {boolean} activeOnly - true if only active actions should be returned, otherwise false
   * @returns {Promise<Array<ActionInfoDto>>} - List of all actions.
   */
  @Get()
  @ApiOperation({ summary: 'Get all actions' })
  @ApiQuery({
    name: 'activeOnly',
    required: false,
    type: Boolean,
    description: 'If true, only active actions are returned',
  })
  @ApiResponse({
    status: 200,
    description: 'List of actions returned successfully.',
    type: [ActionInfoDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  findAll(@Query('activeOnly') activeOnly?: string): Promise<Array<ActionInfoDto>> {
    const activeOnlyBool = activeOnly === 'true';
    return this.actionsService.findAll(activeOnlyBool);
  }

  /**
   * Retrieves a specific action by ID.
   *
   * @param {string} id - UUID of the action to retrieve.
   * @returns {Promise<ActionDetailsDto>} - The action with the specified ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get an action by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the action' })
  @ApiResponse({ status: 200, description: 'Action found.', type: ActionDetailsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Action not found.' })
  @ApiBearerAuth('access-token')
  findOne(@Param('id') id: string): Promise<ActionDetailsDto> {
    return this.actionsService.findOne(id);
  }

  /**
   * Updates an existing action by ID.
   *
   * @param {string} id - UUID of the action to update.
   * @param {UpdateActionDto} updateActionDto - Updated data.
   * @returns {Promise<ActionDetailsDto>} - The updated action.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update an action by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the action' })
  @ApiBody({ type: UpdateActionDto })
  @ApiResponse({ status: 200, description: 'Action updated successfully.', type: ActionDetailsDto })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Action not found.' })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updateActionDto: UpdateActionDto,
  ): Promise<ActionDetailsDto> {
    return this.actionsService.update(id, updateActionDto);
  }

  /**
   * Deletes an action by ID.
   *
   * @param {string} id - UUID of the action to delete.
   * @returns {Promise<void>} - Void if successful.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete an action by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the action' })
  @ApiResponse({ status: 204, description: 'Action deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'Action not found.' })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string): Promise<void> {
    return this.actionsService.remove(id);
  }
}
