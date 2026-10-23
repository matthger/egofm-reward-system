import { ActionLogInfo } from './action-log-info.interface';
import { ActionLogMetadata } from './action-log-metadata.interface';
import { ActionLogStatus } from '../../enums/action-log-status.enum';

/**
 * Represents the details of an action log, including the creation date and optional metadata.
 */
export interface ActionLogDetails extends ActionLogInfo {
  createdAt: Date;
  metadata?: ActionLogMetadata;
  status: ActionLogStatus;
}
