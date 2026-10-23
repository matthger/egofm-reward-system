import { createFeatureSelector, createSelector } from '@ngrx/store';

import { RewardState } from './reward.models';

export const selectRewardState = createFeatureSelector<RewardState>('reward');

export const selectAllRewards = createSelector(selectRewardState, (state) => state.rewards);
export const selectSelectedReward = createSelector(
  selectRewardState,
  (state) => state.selectedReward,
);
export const selectRewardLoading = createSelector(selectRewardState, (state) => state.loading);
export const selectRewardError = createSelector(selectRewardState, (state) => state.error);
