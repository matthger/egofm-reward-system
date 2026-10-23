import { RewardInfo, RewardDetails } from '@egofm-reward/shared';

export interface RewardState {
  rewards: Array<RewardInfo>;
  selectedReward: RewardDetails | null;
  loading: boolean;
  error: unknown;
}

export const initialRewardState: RewardState = {
  rewards: [],
  selectedReward: null,
  loading: false,
  error: null,
};
