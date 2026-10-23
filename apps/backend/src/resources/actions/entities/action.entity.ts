import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ActionInterval, ActionEnum } from '@egofm-reward/shared';

/**
 * Represents an action in the system.
 */
@Entity()
export class Action {
  /**
   * Unique identifier for the action.
   */
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  id: string;

  /**
   * The name of the action, which is an enum value from ActionEnum.
   */
  @Column({
    type: 'enum',
    enum: ActionEnum,
  })
  @IsEnum(ActionEnum)
  name: ActionEnum;

  /**
   * The title of the action.
   */
  @Column({ unique: true })
  @IsString()
  title: string;

  /**
   * A description of the action.
   */
  @Column()
  @IsString()
  description: string;

  /**
   * The number of points awarded for performing the action.
   */
  @Column()
  @IsInt()
  @Min(0)
  points: number;

  /**
   * The interval at which the action can be performed.
   */
  @Column({
    type: 'enum',
    enum: ActionInterval,
  })
  @IsEnum(ActionInterval)
  interval: ActionInterval;

  /**
   * The maximum number of times the action can be performed per day.
   * This field is optional and can be null.
   */
  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxPerDay?: number | null;

  /**
   * Indicates whether the action requires proof of completion.
   */
  @Column({ default: false })
  @IsBoolean()
  requiresProof: boolean;

  /**
   * Indicates whether the action is currently active.
   */
  @Column({ default: true })
  @IsBoolean()
  isActive: boolean;

  /**
   * The date and time when the action was created.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * The date and time when the action was last updated.
   */
  @UpdateDateColumn()
  updatedAt: Date;
}
