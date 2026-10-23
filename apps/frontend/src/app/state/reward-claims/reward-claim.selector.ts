import { createFeatureSelector, createSelector } from '@ngrx/store';

import { RewardClaimState } from './reward-claim.reducer';

export const selectRewardClaimState = createFeatureSelector<RewardClaimState>('rewardClaim');

export const selectRewardClaimLoading = createSelector(
  selectRewardClaimState,
  (state) => state.loading,
);
