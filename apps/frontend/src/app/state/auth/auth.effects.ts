import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  register,
  registerFailure,
  registerSuccess,
} from './auth.actions';
import { selectToken } from './auth.selector';
import { AuthService } from './auth.service';
import { loadActions } from '../action/action.actions';
import { loadLeaderboard } from '../leaderboard/leaderboard.actions';
import { loadLevels } from '../level/level.actions';
import { loadRewards } from '../reward/reward.actions';
import { loadCurrentUser, loadCurrentUserSuccess } from '../user/user.actions';

/**
 * AuthEffects handles authentication-related side effects such as login and logout actions.
 */
@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private store = inject(Store);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(login),
      mergeMap(({ credentials }) =>
        this.authService.login(credentials.username, credentials.password).pipe(
          map((response) => loginSuccess({ response })),
          catchError(() => of(loginFailure({ error: 'Login fehlgeschlagen.' }))),
        ),
      ),
    ),
  );

  loadUserAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginSuccess),
      map(() => loadCurrentUser()),
    ),
  );

  syncAuthAndLoadAppDataAfterUserLoaded$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCurrentUserSuccess),
      withLatestFrom(this.store.select(selectToken)),
      tap(([action, token]) => {
        if (!token) {
          const storedToken = localStorage.getItem('accessToken');
          if (storedToken) {
            this.authService.setAuthFromUser(action.user, storedToken);
          }
        }
      }),
      mergeMap(() => [loadLevels(), loadActions(), loadRewards(), loadLeaderboard()]),
    ),
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          this.authService.logout();
        }),
      ),
    { dispatch: false },
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(register),
      mergeMap(({ user }) =>
        this.authService.register(user).pipe(
          map(() => registerSuccess()),
          catchError((error) => of(registerFailure({ error }))),
        ),
      ),
    ),
  );
}
