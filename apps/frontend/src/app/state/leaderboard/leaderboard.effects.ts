import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import {
  loadLeaderboard,
  loadLeaderboardFailure,
  loadLeaderboardSuccess,
} from './leaderboard.actions';
import { LeaderboardService } from './leaderboard.service';

/**
 * Effects for loading the leaderboard from the backend API.
 */
@Injectable()
export class LeaderboardEffects {
  private actions$ = inject(Actions);
  private leaderboardService = inject(LeaderboardService);

  loadLeaderboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLeaderboard),
      mergeMap(() =>
        this.leaderboardService.getLeaderboard().pipe(
          map((leaderboard) => loadLeaderboardSuccess({ leaderboard })),
          catchError((error) => of(loadLeaderboardFailure({ error }))),
        ),
      ),
    ),
  );
}
