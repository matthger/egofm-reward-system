import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import {
  loadRewards,
  loadRewardsSuccess,
  loadRewardsFailure,
  loadReward,
  loadRewardSuccess,
  loadRewardFailure,
} from './reward.actions';
import { RewardService } from './reward.service';

/**
 * RewardEffects is an Angular service that handles side effects related to rewards.
 */
@Injectable()
export class RewardEffects {
  private readonly actions$ = inject(Actions);
  private readonly rewardService = inject(RewardService);

  loadRewards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRewards),
      mergeMap(() =>
        this.rewardService.getAllRewards().pipe(
          map((rewards) => loadRewardsSuccess({ rewards })),
          catchError((error) => of(loadRewardsFailure({ error }))),
        ),
      ),
    ),
  );

  loadReward$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReward),
      mergeMap(({ id }) =>
        this.rewardService.getRewardById(id).pipe(
          map((reward) => loadRewardSuccess({ reward })),
          catchError((error) => of(loadRewardFailure({ error }))),
        ),
      ),
    ),
  );
}
