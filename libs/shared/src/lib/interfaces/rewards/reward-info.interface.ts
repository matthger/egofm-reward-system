import { RewardEnum } from '../../enums/reward.enum';

/**
 * The RewardInfo interface represents basic information about a reward.
 */
export interface RewardInfo {
  id: string;
  levelId: number;
  name: RewardEnum;
  title: string;
  description: string;
  imageUrl: string;
}
