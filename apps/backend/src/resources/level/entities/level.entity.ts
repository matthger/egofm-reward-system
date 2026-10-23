import { IsInt, IsString, IsUrl, IsOptional, IsNumber, Min } from 'class-validator';
import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';

import { Reward } from '../../rewards/entities/reward.entity';

/**
 * Represents a user level in the system, defining the user's status and associated points.
 */
@Entity()
export class Level {
  /**
   * Unique identifier for the level.
   */
  @PrimaryColumn()
  @IsInt()
  @Min(1)
  id: number;

  /**
   * Name of the level, which describes the user's status.
   */
  @Column()
  @IsString()
  name: string;

  /**
   * URL of the image associated with the level.
   */
  @Column()
  @IsUrl()
  imageUrl: string;

  /**
   * Minimum points required to achieve this level.
   */
  @Column()
  @IsNumber()
  @Min(0)
  minPoints: number;

  /**
   * Maximum points allowed for this level. This can be null if there is no upper limit.
   */
  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPoints: number | null;

  /**
   * Array of rewards associated with this level.
   */
  @OneToMany(() => Reward, (reward) => reward.level, { onDelete: 'CASCADE' })
  rewards: Array<Reward>;
}
