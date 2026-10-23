import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ActionLogMetadata, ActionLogStatus } from '@egofm-reward/shared';

import { Action } from '../../actions/entities/action.entity';
import { User } from '../../users/entities/user.entity';

/**
 * Entity representing a log entry for a performed action by a user.
 */
@Entity()
export class ActionLog {
  /**
   * Unique identifier for the action log entry.
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * The user who performed the action.
   */
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  /**
   * The action that was performed.
   */
  @ApiProperty({ type: () => Action, description: 'The action that was performed.' })
  @ManyToOne(() => Action, { onDelete: 'CASCADE' })
  action: Action;

  /**
   * The timestamp when the action was logged.
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Optional metadata associated with the action.
   */
  @Column({ type: 'jsonb', nullable: true })
  metadata: ActionLogMetadata;

  /**
   * Status of the action log.
   */
  @Column({ type: 'enum', enum: ActionLogStatus, default: ActionLogStatus.CLAIMABLE })
  @IsEnum(ActionLogStatus)
  status: ActionLogStatus;
}
