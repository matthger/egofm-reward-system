import { ActionInterval } from '../../enums/action-interval.enum';
import { ActionEnum } from '../../enums/action.enum';

/**
 * The CreateAction interface defines the structure for creating a new action.
 */
export interface CreateAction {
  name: ActionEnum;
  title: string;
  description: string;
  points: number;
  interval: ActionInterval;
  maxPerDay?: number | null;
  requiresProof: boolean;
  isActive: boolean;
}
