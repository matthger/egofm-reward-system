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
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Role, ValidateResponse } from '@egofm-reward/shared';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Public } from '../../auth/decorator/public.decorator';
import { RequestUser } from '../../auth/decorator/request-user.decorator';
import { Roles } from '../../auth/decorator/roles.decorator';
import { LeaderboardEntryDto } from '../../common/dto/user/leaderboard-entry.dto';
import { UserDetailsDto } from '../../common/dto/user/user-details.dto';
import { UserInfoDto } from '../../common/dto/user/user-info.dto';
import { UserRepresentationDto } from '../../common/dto/user/user-representation.dto';
import { UserWithActionLogsDto } from '../../common/dto/user/user-with-action-logs.dto';
import { UserWithRewardClaimsDto } from '../../common/dto/user/user-with-reward-claims.dto';

/**
 * UsersController handles user-related requests.
 */
@ApiTags('Users')
@Controller('users')
export class UsersController {
  /**
   * Constructor for UsersController.
   *
   * @param {UsersService} usersService - The service to handle user operations.
   */
  constructor(private readonly usersService: UsersService) {}

  /**
   * Creates a new user.
   *
   * @param {CreateUserDto} createUserDto - The data transfer object containing user creation details.
   * @returns {Promise<UserDetailsDto>} - A promise that resolves to the created user.
   */
  @Public()
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: UserDetailsDto,
  })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  create(@Body() createUserDto: CreateUserDto): Promise<UserDetailsDto> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Retrieves all users.
   *
   * @returns {Promise<Array<UserInfoDto>>} - A promise that resolves to an array of users.
   */
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of users returned successfully.',
    type: [UserInfoDto],
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiBearerAuth('access-token')
  @Roles(Role.ADMIN)
  findAll(): Promise<Array<UserInfoDto>> {
    return this.usersService.findAll();
  }

  /**
   * Retrieves the current user making the request.
   *
   * @param {ValidateResponse} user - The user making the request, used for authorization.
   * @returns {Promise<UserRepresentationDto>} - A promise that resolves to the current user's details.
   */
  @Get('me')
  @ApiOperation({ summary: 'Get the current user' })
  @ApiResponse({
    status: 200,
    description: 'Current user details returned successfully.',
    type: UserRepresentationDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiBearerAuth('access-token')
  me(@RequestUser() user: ValidateResponse): Promise<UserRepresentationDto> {
    return this.usersService.me(user.userId);
  }

  /**
   * Retrieves the user leaderboard.
   *
   * @returns {Promise<Array<LeaderboardEntryDto>>} - A promise that resolves to an array of leaderboard entries.
   */
  @Public()
  @Get('leaderboard')
  @ApiOperation({ summary: 'Get the user leaderboard' })
  @ApiOkResponse({ description: 'Returns user leaderboard', type: [LeaderboardEntryDto] })
  async getLeaderboard(): Promise<Array<LeaderboardEntryDto>> {
    return this.usersService.findLeaderboard();
  }

  /**
   * Retrieves a user by ID.
   *
   * @param {ValidateResponse} user - The user making the request, used for authorization.
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<User>} - A promise that resolves to the user with the specified ID.
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the user' })
  @ApiResponse({ status: 200, description: 'User found and returned.', type: UserDetailsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('access-token')
  findOne(@RequestUser() user: ValidateResponse, @Param('id') id: string): Promise<UserDetailsDto> {
    // If the user is not an admin, they can only access their own details
    if (user.role !== Role.ADMIN && user.userId !== id) {
      throw new ForbiddenException('Forbidden resource');
    }

    return this.usersService.findOne(id);
  }

  /**
   * Updates a user by ID.
   *
   * @param {ValidateResponse} user - The user making the request, used for authorization.
   * @param {string} id - The ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - The data transfer object containing the updated user details.
   * @returns {Promise<UserDetailsDto>} - A promise that resolves to the updated user.
   */
  @Put(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the user to update' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully.', type: UserDetailsDto })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('access-token')
  update(
    @RequestUser() user: ValidateResponse,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserDetailsDto> {
    // If the user is not an admin, they can only update their own details
    if (user.role !== Role.ADMIN && user.userId !== id) {
      throw new ForbiddenException('Forbidden resource');
    }

    return this.usersService.update(id, updateUserDto);
  }

  /**
   * Deletes a user by ID.
   *
   * @param {ValidateResponse} user - The user making the request, used for authorization.
   * @param {string} id - The ID of the user to delete.
   * @returns {Promise<void>} - A promise that resolves when the user is deleted.
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the user to delete' })
  @ApiResponse({ status: 204, description: 'User deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('access-token')
  remove(@RequestUser() user: ValidateResponse, @Param('id') id: string): Promise<void> {
    // If the user is not an admin, they can only delete their own account
    if (user.role !== Role.ADMIN && user.userId !== id) {
      throw new ForbiddenException('Forbidden resource');
    }

    return this.usersService.remove(id);
  }

  /**
   * Retrieves all action logs for a specific user by user ID.
   *
   * @param {ValidateResponse} user - The user making the request, used for authorization.
   * @param {string} id - UUID of the user.
   * @returns {Promise<UserWithActionLogsDto>} - A promise that resolves to the user with their action logs.
   */
  @Get(':id/action-logs')
  @ApiOperation({ summary: 'Get all action logs for a specific user' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all action logs for the user',
    type: UserWithActionLogsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('access-token')
  async findAllActionLogs(
    @RequestUser() user: ValidateResponse,
    @Param('id') id: string,
  ): Promise<UserWithActionLogsDto> {
    // If the user is not an admin, they can only access their own action logs
    if (user.role !== Role.ADMIN && user.userId !== id) {
      throw new ForbiddenException('Forbidden resource');
    }

    return this.usersService.findAllActionLogs(id);
  }

  /**
   * Retrieves all reward claims for a specific user by user ID.
   *
   * @param {ValidateResponse} user - The user making the request, used for authorization.
   * @param {string} id - UUID of the user.
   * @returns {Promise<UserWithRewardClaimsDto>} - A promise that resolves to the user with their reward claims.
   */
  @Get(':id/reward-claims')
  @ApiOperation({ summary: 'Get all reward claims for a specific user' })
  @ApiParam({ name: 'id', type: String, description: 'UUID of the user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all reward claims for the user',
    type: UserWithRewardClaimsDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBearerAuth('access-token')
  async findAllRewardClaims(
    @RequestUser() user: ValidateResponse,
    @Param('id') id: string,
  ): Promise<UserWithRewardClaimsDto> {
    // If the user is not an admin, they can only access their own reward claims
    if (user.role !== Role.ADMIN && user.userId !== id) {
      throw new ForbiddenException('Forbidden resource');
    }

    return this.usersService.findAllRewardClaims(id);
  }
}
