import { createReducer, on } from '@ngrx/store';

import {
  loadLeaderboard,
  loadLeaderboardSuccess,
  loadLeaderboardFailure,
} from './leaderboard.actions';
import { initialLeaderboardState } from './leaderboard.models';

export const leaderboardReducer = createReducer(
  initialLeaderboardState,
  on(loadLeaderboard, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(loadLeaderboardSuccess, (state, { leaderboard }) => ({
    ...state,
    leaderboard,
    loading: false,
    error: null,
  })),
  on(loadLeaderboardFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
