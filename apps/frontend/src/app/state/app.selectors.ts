import { createSelector } from '@ngrx/store';

import { selectActionLogLoading } from './action-logs/action-log.selector';
import { selectAuthLoading } from './auth/auth.selector';
import { selectLeaderboardLoading } from './leaderboard/leaderboard.selectors';
import { selectLevelLoading } from './level/level.selector';
import { selectRewardLoading } from './reward/reward.selector';
import { selectRewardClaimLoading } from './reward-claims/reward-claim.selector';
import {
  selectChangePasswordLoading,
  selectUpdateUserLoading,
  selectUserLoading,
} from './user/user.selector';

export const selectAppIsLoading = createSelector(
  selectAuthLoading,
  selectUserLoading,
  selectLevelLoading,
  selectRewardLoading,
  selectChangePasswordLoading,
  selectUpdateUserLoading,
  selectLeaderboardLoading,
  selectActionLogLoading,
  selectRewardClaimLoading,
  (
    authLoading,
    userLoading,
    levelLoading,
    rewardLoading,
    changePasswordLoading,
    updateUserLoading,
    leaderboardLoading,
    actionLogLoading,
    rewardClaimLoading,
  ) =>
    authLoading ||
    userLoading ||
    levelLoading ||
    rewardLoading ||
    changePasswordLoading ||
    updateUserLoading ||
    leaderboardLoading ||
    actionLogLoading ||
    rewardClaimLoading,
);
