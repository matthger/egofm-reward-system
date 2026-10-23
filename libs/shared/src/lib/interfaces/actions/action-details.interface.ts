import { ActionInfo } from './action-info.interface';
import { ActionInterval } from '../../enums/action-interval.enum';

/**
 * Represents the details of an action, including its interval, maximum allowed per day, and whether it requires proof.
 */
export interface ActionDetails extends ActionInfo {
  interval: ActionInterval;
  maxPerDay?: number | null;
  requiresProof: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
