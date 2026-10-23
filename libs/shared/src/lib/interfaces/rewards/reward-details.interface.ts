import { RewardInfo } from './reward-info.interface';

/**
 * Interface representing detailed information about a reward.
 */
export interface RewardDetails extends RewardInfo {
  isActive: boolean;
  isAutomated: boolean;
}
