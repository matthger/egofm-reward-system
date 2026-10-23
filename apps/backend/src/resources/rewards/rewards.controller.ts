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

import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';
import { RewardsService } from './rewards.service';
import { Roles } from '../../auth/decorator/roles.decorator';
import { RewardDetailsDto } from '../../common/dto/reward/reward-details.dto';
import { RewardInfoDto } from '../../common/dto/reward/reward-info.dto';

/**
 * Controller for managing rewards.
 */
@ApiTags('Rewards')
@Controller('rewards')
export class RewardsController {
  /**
   * Constructor for RewardsController.
   *
   * @param {RewardsService} rewardsService - Service for handling reward operations
   */
  constructor(private readonly rewardsService: RewardsService) {}

  /**
   * Creates a new reward.
   *
   * @param {CreateRewardDto} createRewardDto - Data transfer object containing reward details.
   * @returns {Promise<RewardDetailsDto>} The created reward details DTO.
   */
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a new reward' })
  @ApiBody({ type: CreateRewardDto })
  @ApiResponse({
    status: 201,
    description: 'The reward has been successfully created.',
    type: RewardDetailsDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth('access-token')
  create(@Body() createRewardDto: CreateRewardDto): Promise<RewardDetailsDto> {
    return this.rewardsService.create(createRewardDto);
  }

  /**
   * Retrieves all rewards.
   *
   * @param {boolean} activeOnly - true if only active rewards should be returned, otherwise false
   * @returns {Promise<Array<RewardInfoDto>>} A list of reward information DTOs.
   */
  @Get()
  @ApiOperation({ summary: 'Get all rewards' })
  @ApiQuery({
    name: 'activeOnly',
    required: false,
    type: Boolean,
    description: 'If true, only active actions are returned',
  })
  @ApiResponse({
    status: 200,
    description: 'List of rewards returned successfully.',
    type: [RewardInfoDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  findAll(@Query('activeOnly') activeOnly?: string): Promise<Array<RewardInfoDto>> {
    const activeOnlyBool = activeOnly === 'true';
    return this.rewardsService.findAll(activeOnlyBool);
  }

  /**
   * Retrieves a reward by its ID.
   *
   * @param {string} id - The UUID of the reward to retrieve.
   * @returns {Promise<RewardDetailsDto>} The details of the requested reward.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a reward by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the reward' })
  @ApiResponse({ status: 200, description: 'Reward found.', type: RewardDetailsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  @ApiBearerAuth('access-token')
  findOne(@Param('id') id: string): Promise<RewardDetailsDto> {
    return this.rewardsService.findOne(id);
  }

  /**
   * Updates an existing reward.
   *
   * @param {string} id - The UUID of the reward to update.
   * @param {UpdateRewardDto} updateRewardDto - Data transfer object containing updated reward details.
   * @returns {Promise<RewardDetailsDto>} The updated reward details DTO.
   */
  @Roles(Role.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update a reward by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the reward' })
  @ApiBody({ type: UpdateRewardDto })
  @ApiResponse({ status: 200, description: 'Reward updated.', type: RewardDetailsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  @ApiBearerAuth('access-token')
  update(
    @Param('id') id: string,
    @Body() updateRewardDto: UpdateRewardDto,
  ): Promise<RewardDetailsDto> {
    return this.rewardsService.update(id, updateRewardDto);
  }

  /**
   * Deletes a reward by ID.
   *
   * @param {string} id - The UUID of the reward to delete.
   * @returns {Promise<void>} A promise that resolves when the reward is deleted.
   */
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reward by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the reward' })
  @ApiResponse({ status: 204, description: 'Reward deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Reward not found' })
  @ApiBearerAuth('access-token')
  remove(@Param('id') id: string): Promise<void> {
    return this.rewardsService.remove(id);
  }
}
