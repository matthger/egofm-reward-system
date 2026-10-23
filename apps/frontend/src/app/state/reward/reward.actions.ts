import { createAction, props } from '@ngrx/store';

import { RewardInfo, RewardDetails } from '@egofm-reward/shared';

export const loadRewards = createAction('[Reward] Load Rewards');
export const loadRewardsSuccess = createAction(
  '[Reward] Load Rewards Success',
  props<{ rewards: Array<RewardInfo> }>(),
);
export const loadRewardsFailure = createAction(
  '[Reward] Load Rewards Failure',
  props<{ error: unknown }>(),
);

export const loadReward = createAction('[Reward] Load Reward', props<{ id: string }>());
export const loadRewardSuccess = createAction(
  '[Reward] Load Reward Success',
  props<{ reward: RewardDetails }>(),
);
export const loadRewardFailure = createAction(
  '[Reward] Load Reward Failure',
  props<{ error: unknown }>(),
);
