import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Role } from '@egofm-reward/shared';

import { CreateLevelDto } from './dto/create-level.dto';
import { UpdateLevelDto } from './dto/update-level.dto';
import { LevelService } from './level.service';
import { Roles } from '../../auth/decorator/roles.decorator';
import { LevelDetailsDto } from '../../common/dto/level/level-details.dto';
import { LevelInfoDto } from '../../common/dto/level/level-info.dto';
import { LevelWithRewardsDto } from '../../common/dto/level/level-with-rewards.dto';

/**
 * Controller for managing user levels in the system.
 */
@ApiTags('Level')
@Controller('level')
export class LevelController {
  /**
   * Constructor for LevelController.
   *
   * @param {LevelService} levelService - The service responsible for level operations.
   */
  constructor(private readonly levelService: LevelService) {}

  /**
   * Creates a new level.
   *
   * @param {CreateLevelDto} createLevelDto - DTO with level creation data.
   * @returns {Promise<LevelDetailsDto>} - The created level.
   */
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new level' })
  @ApiResponse({ status: 201, description: 'Level created successfully', type: LevelDetailsDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth('access-token')
  create(@Body() createLevelDto: CreateLevelDto): Promise<LevelDetailsDto> {
    return this.levelService.create(createLevelDto);
  }

  /**
   * Retrieves all levels.
   *
   * @returns {Promise<Array<LevelInfoDto>>} - A list of all levels.
   */
  @Get()
  @ApiOperation({ summary: 'Get all levels' })
  @ApiResponse({ status: 200, description: 'List of levels', type: [LevelInfoDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  findAll(): Promise<Array<LevelInfoDto>> {
    return this.levelService.findAll();
  }

  /**
   * Retrieves a single level by ID.
   *
   * @param {string} id - The ID of the level to retrieve.
   * @returns {Promise<LevelDetailsDto>} - The found level.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a level by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Level ID' })
  @ApiResponse({ status: 200, description: 'Level found', type: LevelDetailsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Level not found' })
  @ApiBearerAuth('access-token')
  findOne(@Param('id') id: string): Promise<LevelDetailsDto> {
    return this.levelService.findOne(id);
  }

  /**
   * Updates a level by ID.
   *
   * @param {string} id - The ID of the level to update.
   * @param {UpdateLevelDto} updateLevelDto - DTO with update data.
   * @returns {Promise<LevelDetailsDto>} - The updated level.
   */
  @Roles(Role.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update a level by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Level ID' })
  @ApiResponse({ status: 200, description: 'Level updated', type: LevelDetailsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  update(
    @Param('id') id: string,
    @Body() updateLevelDto: UpdateLevelDto,
  ): Promise<LevelDetailsDto> {
    return this.levelService.update(id, updateLevelDto);
  }

  /**
   * Deletes a level by ID.
   *
   * @param {string} id - The ID of the level to delete.
   * @returns {Promise<void>}
   */
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a level by ID' })
  @ApiParam({ name: 'id', type: Number, description: 'Level ID' })
  @ApiResponse({ status: 204, description: 'Level deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Level not found' })
  @ApiBearerAuth('access-token')
  remove(@Param('id') id: string): Promise<void> {
    return this.levelService.remove(id);
  }

  /**
   * Retrieves all rewards associated with a specific level.
   *
   * @param {string} id - The ID of the level for which to retrieve rewards.
   * @returns {Promise<LevelWithRewardsDto>} - A DTO containing the level and its associated rewards.
   */
  @Get(':id/rewards')
  @ApiOperation({ summary: 'Get all rewards for a level' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the level' })
  @ApiResponse({
    status: 200,
    description: '',
    type: LevelWithRewardsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Level not found' })
  @ApiBearerAuth('access-token')
  async findAllRewards(@Param('id') id: string): Promise<LevelWithRewardsDto> {
    return this.levelService.findAllRewards(id);
  }
}
