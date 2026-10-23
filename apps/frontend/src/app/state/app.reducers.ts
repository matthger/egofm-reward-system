import { ActionReducerMap } from '@ngrx/store';

import { actionReducer } from './action/action.reducer';
import { actionLogReducer } from './action-logs/action-log.reducer';
import { authReducer } from './auth/auth.reducer';
import { leaderboardReducer } from './leaderboard/leaderboard.reducer';
import { levelReducer } from './level/level.reducer';
import { rewardReducer } from './reward/reward.reducer';
import { rewardClaimReducer } from './reward-claims/reward-claim.reducer';
import { userReducer } from './user/user.reducer';

export interface AppState {
  auth: ReturnType<typeof authReducer>;
  user: ReturnType<typeof userReducer>;
  level: ReturnType<typeof levelReducer>;
  action: ReturnType<typeof actionReducer>;
  reward: ReturnType<typeof rewardReducer>;
  leaderboard: ReturnType<typeof leaderboardReducer>;
  actionLog: ReturnType<typeof actionLogReducer>;
  rewardClaim: ReturnType<typeof rewardClaimReducer>;
}

export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  user: userReducer,
  level: levelReducer,
  action: actionReducer,
  reward: rewardReducer,
  leaderboard: leaderboardReducer,
  actionLog: actionLogReducer,
  rewardClaim: rewardClaimReducer,
};
