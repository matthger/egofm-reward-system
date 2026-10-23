import { createAction, props } from '@ngrx/store';

import { CreateRewardClaim } from '@egofm-reward/shared';

export const createRewardClaim = createAction(
  '[RewardClaim] Create Reward Claim',
  props<{ payload: CreateRewardClaim }>(),
);
export const createRewardClaimSuccess = createAction('[RewardClaim] Create Reward Claim Success');
export const createRewardClaimFailure = createAction(
  '[RewardClaim] Create Reward Claim Failure',
  props<{ error: unknown }>(),
);
