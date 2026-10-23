import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import {
  loadLevel,
  loadLevelFailure,
  loadLevels,
  loadLevelsFailure,
  loadLevelsSuccess,
  loadLevelSuccess,
} from './level.actions';
import { LevelService } from './level.service';

/**
 * LevelEffects handles side effects related to levels, such as loading levels and a specific level.
 */
@Injectable()
export class LevelEffects {
  private readonly actions$ = inject(Actions);
  private readonly levelService = inject(LevelService);

  loadLevels$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLevels),
      mergeMap(() =>
        this.levelService.getAllLevels().pipe(
          map((levels) => loadLevelsSuccess({ levels })),
          catchError((error) => of(loadLevelsFailure({ error }))),
        ),
      ),
    ),
  );

  loadLevel$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLevel),
      mergeMap(({ id }) =>
        this.levelService.getLevelById(id).pipe(
          map((level) => loadLevelSuccess({ level })),
          catchError((error) => of(loadLevelFailure({ error }))),
        ),
      ),
    ),
  );
}
