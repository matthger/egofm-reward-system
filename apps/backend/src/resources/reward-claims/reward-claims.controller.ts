import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { Role, ValidateResponse } from '@egofm-reward/shared';

import { CreateRewardClaimDto } from './dto/create-reward-claim.dto';
import { UpdateRewardClaimDto } from './dto/update-reward-claim.dto';
import { RewardClaimsService } from './reward-claims.service';
import { RequestUser } from '../../auth/decorator/request-user.decorator';
import { Roles } from '../../auth/decorator/roles.decorator';
import { RewardClaimInfoDto } from '../../common/dto/reward-claim/reward-claim-info.dto';

/**
 * Controller for managing reward claims.
 */
@ApiTags('Reward Claims')
@Controller('reward-claims')
export class RewardClaimsController {
  /**
   * Constructor for RewardClaimsController.
   *
   * @param {RewardClaimsService} rewardClaimsService Service for handling reward claims logic.
   */
  constructor(private readonly rewardClaimsService: RewardClaimsService) {}

  /**
   * Creates a new reward claim.
   *
   * @param {ValidateResponse} user - The user making the request, used for authorization.
   * @param {CreateRewardClaimDto} createRewardClaimDto DTO with reward claim creation data.
   * @returns {Promise<RewardClaimInfoDto>} The created reward claim.
   */
  @Post()
  @ApiOperation({ summary: 'Create a new reward claim' })
  @ApiBody({ type: CreateRewardClaimDto })
  @ApiResponse({ status: 201, type: RewardClaimInfoDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth('access-token')
  create(
    @RequestUser() user: ValidateResponse,
    @Body() createRewardClaimDto: CreateRewardClaimDto,
  ): Promise<RewardClaimInfoDto> {
    // If the user is not an admin, they can only create claims for themselves
    if (user.role !== Role.ADMIN && user.userId !== createRewardClaimDto.userId) {
      throw new ForbiddenException('Forbidden resource');
    }

    return this.rewardClaimsService.create(createRewardClaimDto);
  }

  /**
   * Retrieves all reward claims.
   *
   * @returns {Promise<Array<RewardClaimInfoDto>>} List of reward claims.
   */
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({ summary: 'Get all reward claims' })
  @ApiResponse({ status: 200, type: [RewardClaimInfoDto] })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth('access-token')
  findAll(): Promise<Array<RewardClaimInfoDto>> {
    return this.rewardClaimsService.findAll();
  }

  /**
   * Retrieves a reward claim by ID.
   *
   * @param {string} id UUID of the reward claim.
   * @returns {Promise<RewardClaimInfoDto>} The requested reward claim.
   */
  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({ summary: 'Get a reward claim by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: RewardClaimInfoDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'RewardClaim not found' })
  @ApiBearerAuth('access-token')
  findOne(@Param('id') id: string): Promise<RewardClaimInfoDto> {
    return this.rewardClaimsService.findOne(id);
  }

  /**
   * Updates a reward claim by ID.
   *
   * @param {string} id UUID of the reward claim.
   * @param {UpdateRewardClaimDto} updateRewardClaimDto DTO with updated data.
   * @returns {Promise<RewardClaimInfoDto>} The updated reward claim.
   */
  @Roles(Role.ADMIN)
  @Put(':id')
  @ApiOperation({ summary: 'Update a reward claim by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: UpdateRewardClaimDto })
  @ApiResponse({ status: 200, type: RewardClaimInfoDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'RewardClaim not found' })
  @ApiBearerAuth('access-token')
  update(
    @Param('id') id: string,
    @Body() updateRewardClaimDto: UpdateRewardClaimDto,
  ): Promise<RewardClaimInfoDto> {
    return this.rewardClaimsService.update(id, updateRewardClaimDto);
  }

  /**
   * Deletes a reward claim by ID.
   *
   * @param {string} id UUID of the reward claim.
   * @returns {Promise<void>} No return value.
   */
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reward claim by ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 204, description: 'Successfully deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'RewardClaim not found' })
  @ApiBearerAuth('access-token')
  async remove(@Param('id') id: string): Promise<void> {
    return this.rewardClaimsService.remove(id);
  }
}
