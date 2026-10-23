import { ActionEnum } from '../../enums/action.enum';

/**
 * Represents the basic information of an action, including its ID, name, title, description, and points.
 */
export interface ActionInfo {
  id: string;
  name: ActionEnum;
  title: string;
  description: string;
  points: number;
}
