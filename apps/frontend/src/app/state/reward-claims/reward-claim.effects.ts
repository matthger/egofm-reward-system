import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import {
  createRewardClaim,
  createRewardClaimFailure,
  createRewardClaimSuccess,
} from './reward-claim.actions';
import { RewardClaimService } from './reward-claim.service';
import { loadCurrentUser } from '../user/user.actions';

/**
 * NgRx effects for handling reward claim actions.
 */
@Injectable()
export class RewardClaimEffects {
  private readonly actions$ = inject(Actions);
  private readonly rewardClaimService = inject(RewardClaimService);

  createRewardClaim$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createRewardClaim),
      mergeMap(({ payload }) =>
        this.rewardClaimService.createRewardClaim(payload).pipe(
          map(() => createRewardClaimSuccess()),
          catchError((error) => of(createRewardClaimFailure({ error }))),
        ),
      ),
    ),
  );

  reloadCurrentUserAfterRewardClaim$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createRewardClaimSuccess),
      map(() => loadCurrentUser()),
    ),
  );
}
