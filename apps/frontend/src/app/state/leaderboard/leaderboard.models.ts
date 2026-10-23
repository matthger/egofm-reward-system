import { LeaderboardEntry } from '@egofm-reward/shared';

export interface LeaderboardState {
  leaderboard: Array<LeaderboardEntry>;
  loading: boolean;
  error: unknown;
}

export const initialLeaderboardState: LeaderboardState = {
  leaderboard: [],
  loading: false,
  error: null,
};
