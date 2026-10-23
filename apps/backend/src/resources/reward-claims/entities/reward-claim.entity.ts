import { IsUUID, IsEnum } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { RewardClaimStatus } from '@egofm-reward/shared';

import { Level } from '../../level/entities/level.entity';
import { Reward } from '../../rewards/entities/reward.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Entity representing a claimed reward by a user.
 */
@Entity()
export class RewardClaim {
  /**
   * Unique identifier for the reward claim.
   */
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  /**
   * Relation to the user who claimed the reward.
   */
  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  /**
   * Relation to the reward.
   */
  @ManyToOne(() => Reward, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'rewardId' })
  reward: Reward;

  /**
   * The level of the user, defaulting to 1.
   */
  @ManyToOne(() => Level)
  @JoinColumn({ name: 'level' })
  level: Level;

  /**
   * Timestamp when the reward was claimed.
   */
  @CreateDateColumn({ type: 'timestamp' })
  claimedAt: Date;

  /**
   * Status of the reward claim.
   */
  @Column({ type: 'enum', enum: RewardClaimStatus })
  @IsEnum(RewardClaimStatus)
  status: RewardClaimStatus;
}
