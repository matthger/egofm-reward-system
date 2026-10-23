import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import {
  loadActions,
  loadActionsSuccess,
  loadActionsFailure,
  loadAction,
  loadActionSuccess,
  loadActionFailure,
} from './action.actions';
import { ActionService } from './action.service';

/**
 * Effects for handling actions related to rewards.
 */
@Injectable()
export class ActionEffects {
  private readonly actions$ = inject(Actions);
  private readonly actionService = inject(ActionService);

  loadActions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadActions),
      mergeMap(() =>
        this.actionService.getAllActions().pipe(
          map((actions) => loadActionsSuccess({ actions })),
          catchError((error) => of(loadActionsFailure({ error }))),
        ),
      ),
    ),
  );

  loadAction$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAction),
      mergeMap(({ id }) =>
        this.actionService.getActionById(id).pipe(
          map((action) => loadActionSuccess({ action })),
          catchError((error) => of(loadActionFailure({ error }))),
        ),
      ),
    ),
  );
}
