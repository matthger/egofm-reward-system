import { createAction, props } from '@ngrx/store';

import { LeaderboardEntry } from '@egofm-reward/shared';

export const loadLeaderboard = createAction('[Leaderboard] Load Leaderboard');
export const loadLeaderboardSuccess = createAction(
  '[Leaderboard] Load Leaderboard Success',
  props<{ leaderboard: Array<LeaderboardEntry> }>(),
);
export const loadLeaderboardFailure = createAction(
  '[Leaderboard] Load Leaderboard Failure',
  props<{ error: unknown }>(),
);
