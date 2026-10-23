import { createReducer, on } from '@ngrx/store';

import {
  loadRewards,
  loadRewardsSuccess,
  loadRewardsFailure,
  loadReward,
  loadRewardSuccess,
  loadRewardFailure,
} from './reward.actions';
import { initialRewardState } from './reward.models';

export const rewardReducer = createReducer(
  initialRewardState,

  on(loadRewards, (state) => ({ ...state, loading: true, error: null })),
  on(loadRewardsSuccess, (state, { rewards }) => ({ ...state, loading: false, rewards })),
  on(loadRewardsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(loadReward, (state) => ({ ...state, loading: true, error: null })),
  on(loadRewardSuccess, (state, { reward }) => ({
    ...state,
    loading: false,
    selectedReward: reward,
  })),
  on(loadRewardFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
