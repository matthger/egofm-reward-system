import { RewardEnum } from '../../enums/reward.enum';

/**
 * Interface for creating a reward.
 */
export interface CreateReward {
  levelId: number;
  name: RewardEnum;
  title: string;
  description: string;
  imageUrl: string;
  isActive?: boolean;
  isAutomated?: boolean;
}
