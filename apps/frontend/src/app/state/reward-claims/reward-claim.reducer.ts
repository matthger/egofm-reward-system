import { createReducer, on } from '@ngrx/store';

import {
  createRewardClaim,
  createRewardClaimFailure,
  createRewardClaimSuccess,
} from './reward-claim.actions';

export interface RewardClaimState {
  loading: boolean;
  error: unknown;
}

export const initialState: RewardClaimState = {
  loading: false,
  error: null,
};

export const rewardClaimReducer = createReducer(
  initialState,
  on(createRewardClaim, (state) => ({ ...state, loading: true, error: null })),
  on(createRewardClaimSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(createRewardClaimFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
