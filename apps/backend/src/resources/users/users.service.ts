import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { DeleteResult, Repository } from 'typeorm';

import { Role } from '@egofm-reward/shared';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { ActionLogDetailsDto } from '../../common/dto/action-log/action-log-details.dto';
import { RewardClaimInfoDto } from '../../common/dto/reward-claim/reward-claim-info.dto';
import { LeaderboardEntryDto } from '../../common/dto/user/leaderboard-entry.dto';
import { UserDetailsDto } from '../../common/dto/user/user-details.dto';
import { UserInfoDto } from '../../common/dto/user/user-info.dto';
import { UserRepresentationDto } from '../../common/dto/user/user-representation.dto';
import { UserWithActionLogsDto } from '../../common/dto/user/user-with-action-logs.dto';
import { UserWithRewardClaimsDto } from '../../common/dto/user/user-with-reward-claims.dto';
import { ActionLog } from '../action-logs/entities/action-log.entity';
import { Level } from '../level/entities/level.entity';
import { RewardClaim } from '../reward-claims/entities/reward-claim.entity';

/**
 * The UsersService class provides methods to manage user entities in the database.
 */
@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  /**
   * Constructs a new instance of UsersService.
   *
   * @param {Repository<User>} userRepository - The TypeORM repository for the User entity.
   * @param {Repository<Level>} levelRepository - The TypeORM repository for the Level entity.
   */
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Level)
    private readonly levelRepository: Repository<Level>,
  ) {}

  /**
   * Creates a new user with a hashed password.
   *
   * @param {CreateUserDto} createUserDto - The data transfer object containing user details.
   * @returns {Promise<UserDetailsDto>} - A promise that resolves to the created user entity.
   */
  async create(createUserDto: CreateUserDto): Promise<UserDetailsDto> {
    this.logger.log(`Creating user: ${createUserDto.username}`);
    try {
      const { password, ...otherValues } = createUserDto;
      const firstLevel: Level = await this.levelRepository.findOneByOrFail({ id: 1 });
      const passwordHash: string = await bcrypt.hash(password, 10);

      const user: User = this.userRepository.create({
        ...otherValues,
        passwordHash,
        level: firstLevel,
      });

      const savedUser: User = await this.userRepository.save(user);
      this.logger.log(`User created: ${savedUser.id} (${savedUser.username})`);
      return this.mapToUserDetailsDto(savedUser);
    } catch (error) {
      this.logger.error(`Error creating user: ${createUserDto.username}`, error.stack);
      throw error;
    }
  }

  /**
   * Retrieves all users from the database.
   *
   * @returns {Promise<Array<UserInfoDto>>} - A promise that resolves to an array of user entities.
   */
  async findAll(): Promise<Array<UserInfoDto>> {
    this.logger.log('Fetching all users');
    const users: Array<User> = await this.userRepository.find();
    return users.map((user: User): UserInfoDto => this.mapToUserInfoDto(user));
  }

  /**
   * Retrieves a user by their ID.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<UserDetailsDto>} - A promise that resolves to the user details dto.
   */
  async findOne(id: string): Promise<UserDetailsDto> {
    this.logger.log(`Fetching user by ID: ${id}`);
    const user: User = await this.findUserById(id);
    return this.mapToUserDetailsDto(user);
  }

  /**
   * Finds a user by their username.
   *
   * @param {string} username - The username of the user to find.
   * @returns {Promise<User>} - A promise that resolves to the user entity.
   */
  async findByUsername(username: string): Promise<User> {
    this.logger.log(`Looking up user by username: ${username}`);
    const user: User | null = await this.userRepository.findOne({
      where: { username },
    });
    if (!user) {
      this.logger.warn(`User not found: ${username}`);
      throw new NotFoundException(`User with username ${username} not found`);
    }
    this.logger.log(`User found: ${user.id} (${user.username})`);
    return user;
  }

  /**
   * Retrieves the current user's details based on their ID.
   *
   * @param {string} id - The ID of the user to retrieve.
   * @returns {Promise<UserRepresentationDto>} - A promise that resolves to the user representation dto.
   */
  async me(id: string): Promise<UserRepresentationDto> {
    this.logger.log(`Fetching profile for user ID: ${id}`);
    const user: User = await this.findUserById(id);
    return this.mapToUserRepresentationDto(user);
  }

  /**
   * Retrieves the leaderboard of users ordered by points.
   *
   * @returns {Promise<Array<LeaderboardEntryDto>>} - A promise that resolves to an array of leaderboard entries.
   */
  async findLeaderboard(): Promise<Array<LeaderboardEntryDto>> {
    const users: Array<User> = await this.userRepository.find({
      order: { points: 'DESC' },
      select: ['username', 'points'],
      where: { role: Role.USER },
    });

    return users.map(
      (user: User, index: number): LeaderboardEntryDto => ({
        username: user.username,
        points: user.points,
        rank: index + 1,
      }),
    );
  }

  /**
   * Updates a user with the provided data.
   *
   * @param {string} id - The ID of the user to update.
   * @param {UpdateUserDto} updateUserDto - The data transfer object containing the updated user details.
   * @returns {Promise<UserDetailsDto>} - A promise that resolves to the updated user entity.
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDetailsDto> {
    this.logger.log(`Updating user ${id}`);

    try {
      const user: User = await this.findUserById(id);

      if (updateUserDto.password && updateUserDto.oldPassword) {
        const isPasswordValid = await bcrypt.compare(updateUserDto.oldPassword, user.passwordHash);

        if (!isPasswordValid) {
          this.logger.warn(`Invalid old password for user ${id}`);
          throw new BadRequestException('Das alte Passwort ist nicht korrekt.');
        }

        user.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      }

      // Exclude birthDate, password and oldPassword from the update object
      const {
        birthDate: _birthDate,
        password: _password,
        oldPassword: _oldPassword,
        ...otherUpdates
      } = updateUserDto;
      Object.assign(user, otherUpdates);

      const updatedUser: User = await this.userRepository.save(user);
      this.logger.log(`User updated: ${updatedUser.id}`);

      return this.mapToUserDetailsDto(updatedUser);
    } catch (error) {
      this.logger.error(`Error updating user ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Adds points to a user's account and updates their level if necessary.
   *
   * @param {string} id - The ID of the user.
   * @param {number} pointsToAdd - The number of points to add.
   * @returns {Promise<{ leveledUp: boolean; newLevel?: Level }>} - A promise indicating whether the user leveled up and, if so, the new level.
   */
  async addPoints(
    id: string,
    pointsToAdd: number,
  ): Promise<{ leveledUp: boolean; newLevel?: Level }> {
    this.logger.debug(`Adding ${pointsToAdd} points for user ${id}`);

    try {
      const user: User = await this.findUserById(id);
      const previousLevelId: number = user.level.id;

      user.points += pointsToAdd;

      const allLevels: Array<Level> = await this.levelRepository.find();
      const matchingLevel = allLevels.find((level) => {
        const meetsMin = user.points >= level.minPoints;
        const belowMax = level.maxPoints === null || user.points < level.maxPoints;
        return meetsMin && belowMax;
      });

      if (!matchingLevel) {
        this.logger.warn(`No matching level found for ${user.points} points`);
      } else if (matchingLevel.id !== previousLevelId) {
        this.logger.log(
          `User ${id} leveled up from level ${previousLevelId} to ${matchingLevel.id} (${matchingLevel.name})`,
        );
        user.level = matchingLevel;
      }

      await this.userRepository.save(user);
      this.logger.debug(`Successfully updated user ${id} with new point total: ${user.points}`);

      const leveledUp: boolean = user.level.id !== previousLevelId;
      return leveledUp ? { leveledUp: true, newLevel: user.level } : { leveledUp: false };
    } catch (error) {
      this.logger.error(`Error updating points for user ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Sets the last login date for a user.
   *
   * @param {string} id - The ID of the user.
   * @param {Date} lastLogin - The date of the last login.
   */
  async setLastLogin(id: string, lastLogin: Date): Promise<void> {
    this.logger.debug(`Setting lastLogin for user ${id} to ${lastLogin.toISOString()}`);
    try {
      const user: User = await this.findUserById(id);
      user.lastLogin = lastLogin;
      await this.userRepository.save(user);
    } catch (error) {
      this.logger.error(`Error setting lastLogin for user ${id}`, error.stack);
      throw error;
    }
  }

  /**
   * Deletes a user by their ID.
   *
   * @param {string} id - The ID of the user to delete.
   */
  async remove(id: string): Promise<void> {
    this.logger.warn(`Deleting user: ${id}`);
    const result: DeleteResult = await this.userRepository.delete(id);
    if (result.affected === 0) {
      this.logger.warn(`User not found for deletion: ${id}`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    this.logger.log(`User deleted: ${id}`);
  }

  /**
   * Finds all action logs for a given user ID.
   *
   * @param {string} userId - UUID of the user.
   * @returns {Promise<UserWithActionLogsDto>} - A promise that resolves to the user with their action logs.
   */
  async findAllActionLogs(userId: string): Promise<UserWithActionLogsDto> {
    this.logger.log(`Fetching action logs for user ${userId}`);
    const userEntity: User = await this.findUserById(userId);

    return {
      ...this.mapToUserInfoDto(userEntity),
      actionLogs: userEntity.actionLogs.map(
        (actionLog: ActionLog): ActionLogDetailsDto => ({
          id: actionLog.id,
          userId: userEntity.id,
          actionId: actionLog.action.id,
          createdAt: actionLog.createdAt,
          metadata: actionLog.metadata,
          status: actionLog.status,
        }),
      ),
    };
  }

  /**
   * Finds all reward claims for a given user ID.
   *
   * @param {string} userId - UUID of the user.
   * @returns {Promise<UserWithRewardClaimsDto>} - A promise that resolves to the user with their reward claims.
   */
  async findAllRewardClaims(userId: string): Promise<UserWithRewardClaimsDto> {
    this.logger.log(`Fetching reward claims for user ${userId}`);
    const userEntity: User = await this.findUserById(userId);

    return {
      ...this.mapToUserInfoDto(userEntity),
      rewardClaims: userEntity.rewardClaims.map(
        (reward: RewardClaim): RewardClaimInfoDto => ({
          id: reward.id,
          userId: userEntity.id,
          rewardId: reward.reward.id,
          claimedAt: reward.claimedAt,
          status: reward.status,
          levelId: reward.level.id,
        }),
      ),
    };
  }

  /**
   * Finds a user by their ID.
   *
   * @param {string} id - The ID of the user to find.
   * @returns {Promise<User>} - A promise that resolves to the user entity.
   */
  async findUserById(id: string): Promise<User> {
    this.logger.debug(`Looking up user entity by ID: ${id}`);
    const user: User | null = await this.userRepository.findOne({
      relations: [
        'actionLogs',
        'actionLogs.action',
        'level',
        'rewardClaims',
        'rewardClaims.reward',
        'rewardClaims.level',
      ],
      where: { id },
    });
    if (!user) {
      this.logger.warn(`User entity not found: ${id}`);
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  /**
   * Maps a User entity to a UserInfoDto object.
   *
   * @param {User} user - The user entity to map.
   * @returns {UserInfoDto} - The mapped UserInfoDto object.
   * @private
   */
  private mapToUserInfoDto(user: User): UserInfoDto {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      joinedAt: user.joinedAt,
    };
  }

  /**
   * Maps a User entity to a UserDetailsDto object.
   *
   * @param {User} user - The user entity to map.
   * @returns {UserDetailsDto} - The mapped UserDetailsDto object.
   * @private
   */
  private mapToUserDetailsDto(user: User): UserDetailsDto {
    return {
      ...this.mapToUserInfoDto(user),
      role: user.role,
      birthDate: user.birthDate,
      currentStreak: user.currentStreak,
      points: user.points,
      levelId: user.level.id,
      lastLogin: user.lastLogin,
    };
  }

  /**
   * Maps a User entity to a UserRepresentationDto object, which includes action logs and reward claims.
   *
   * @param {User} user - The user entity to map.
   * @returns {UserRepresentationDto} - The mapped UserRepresentationDto object.
   * @private
   */
  private mapToUserRepresentationDto(user: User): UserRepresentationDto {
    return {
      ...this.mapToUserDetailsDto(user),
      actionLogs: user.actionLogs.map(
        (actionLog: ActionLog): ActionLogDetailsDto => ({
          id: actionLog.id,
          userId: user.id,
          actionId: actionLog.action.id,
          createdAt: actionLog.createdAt,
          metadata: actionLog.metadata,
          status: actionLog.status,
        }),
      ),
      rewardClaims: user.rewardClaims.map(
        (reward: RewardClaim): RewardClaimInfoDto => ({
          id: reward.id,
          userId: user.id,
          rewardId: reward.reward.id,
          claimedAt: reward.claimedAt,
          status: reward.status,
          levelId: reward.level.id,
        }),
      ),
    };
  }
}
