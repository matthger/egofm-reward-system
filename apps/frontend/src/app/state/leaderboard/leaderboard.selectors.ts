import { createFeatureSelector, createSelector } from '@ngrx/store';

import { LeaderboardState } from './leaderboard.models';

export const selectLeaderboardFeature = createFeatureSelector<LeaderboardState>('leaderboard');

export const selectLeaderboard = createSelector(
  selectLeaderboardFeature,
  (state) => state.leaderboard,
);
export const selectLeaderboardLoading = createSelector(
  selectLeaderboardFeature,
  (state) => state.loading,
);
export const selectLeaderboardError = createSelector(
  selectLeaderboardFeature,
  (state) => state.error,
);
