import { IsBoolean, IsEnum, IsString, IsUrl, IsUUID } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

import { RewardEnum } from '@egofm-reward/shared';

import { Level } from '../../level/entities/level.entity';

/**
 * Entity representing a reward in the system.
 */
@Entity()
export class Reward {
  /**
   * Unique identifier for the reward.
   */
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  /**
   * Level associated with this reward.
   */
  @ManyToOne(() => Level, (level) => level.rewards, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'levelId' })
  level: Level;

  /**
   * The name of the reward, which is an enum value from ActionEnum.
   */
  @Column({
    type: 'enum',
    enum: RewardEnum,
  })
  @IsEnum(RewardEnum)
  name: RewardEnum;

  /**
   * Title of the reward.
   */
  @Column()
  @IsString()
  title: string;

  /**
   * Description of the reward.
   */
  @Column()
  @IsString()
  description: string;

  /**
   * Image URL for the reward.
   */
  @Column()
  @IsUrl()
  imageUrl: string;

  /**
   * Whether the reward is currently active.
   */
  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  /**
   * Whether the reward is automatically granted.
   */
  @Column({ default: false })
  @IsBoolean()
  isAutomated: boolean;
}
