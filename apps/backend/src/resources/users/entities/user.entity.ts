import {
  IsUUID,
  IsEmail,
  IsString,
  IsOptional,
  IsDate,
  IsNumber,
  Min,
  IsEnum,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Role } from '@egofm-reward/shared';

import { ActionLog } from '../../action-logs/entities/action-log.entity';
import { Level } from '../../level/entities/level.entity';
import { RewardClaim } from '../../reward-claims/entities/reward-claim.entity';

/**
 * Represents a user in the system.
 */
@Entity()
export class User {
  /**
   * Unique identifier for the user.
   */
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  /**
   * The email address of the user.
   */
  @Column({ unique: true })
  @IsEmail()
  email: string;

  /**
   * The username of the user.
   */
  @Column({ unique: true })
  @IsString()
  username: string;

  /**
   * The hashed password of the user.
   */
  @Column()
  @IsString()
  passwordHash: string;

  /**
   * The role of the user, defaulting to 'user'.
   */
  @Column({ type: 'enum', enum: Role, default: Role.USER })
  @IsEnum(Role)
  role: Role;

  /**
   * The display name of the user.
   */
  @Column({ default: 0 })
  @IsNumber()
  @Min(0)
  points: number;

  /**
   * The level of the user, defaulting to 1.
   */
  @ManyToOne(() => Level)
  @JoinColumn({ name: 'level' })
  level: Level;

  /**
   * The birthdate of the user, if provided.
   */
  @Column({ type: 'date', nullable: true })
  @IsOptional()
  @IsDate()
  birthDate: Date;

  /**
   * The date when the user joined the system.
   */
  @CreateDateColumn()
  @IsDate()
  joinedAt: Date;

  /**
   * The current listening streak of the user, defaulting to 0.
   */
  @Column({ default: 0 })
  @IsNumber()
  @Min(0)
  currentStreak: number;

  /**
   * The last login date of the user, if available.
   */
  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  lastLogin: Date;

  /**
   * The logged actions performed by the user.
   */
  @OneToMany(() => ActionLog, (actionLog) => actionLog.user)
  actionLogs: Array<ActionLog>;

  /**
   * The reward claims made by the user.
   */
  @OneToMany(() => RewardClaim, (rewardClaim) => rewardClaim.user)
  rewardClaims: Array<RewardClaim>;
}
