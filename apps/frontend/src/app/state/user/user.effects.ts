import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';

import {
  changePassword,
  changePasswordFailure,
  changePasswordSuccess,
  deleteUser,
  deleteUserFailure,
  deleteUserSuccess,
  loadCurrentUser,
  loadCurrentUserFailure,
  loadCurrentUserSuccess,
  updateUser,
  updateUserFailure,
  updateUserSuccess,
} from './user.actions';
import { UserService } from './user.service';
import { logout } from '../auth/auth.actions';

/**
 * UserEffects handles user-related side effects such as loading the current user.
 */
@Injectable()
export class UserEffects {
  private readonly actions$ = inject(Actions);
  private readonly userService = inject(UserService);

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCurrentUser),
      mergeMap(() =>
        this.userService.getMe().pipe(
          map((user) => loadCurrentUserSuccess({ user })),
          catchError((error) => of(loadCurrentUserFailure({ error }))),
        ),
      ),
    ),
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(changePassword),
      mergeMap(({ id, oldPassword, password }) =>
        this.userService.updateUser(id, { oldPassword, password }).pipe(
          map((user) => changePasswordSuccess({ user })),
          catchError(() =>
            of(
              changePasswordFailure({
                error: 'Passwort ändern fehlgeschlagen. Versuchen Sie es bitte später erneut.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      mergeMap(({ id, user }) =>
        this.userService.updateUser(id, user).pipe(
          map((user) => updateUserSuccess({ user })),
          catchError(() =>
            of(
              updateUserFailure({
                error: 'Update fehlgeschlagen. Versuchen Sie es bitte später erneut.',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loadCurrentUserAfterUpdate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserSuccess, changePasswordSuccess),
      map(() => loadCurrentUser()),
    ),
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUser),
      mergeMap(({ id }) =>
        this.userService.deleteUser(id).pipe(
          map(() => deleteUserSuccess()),
          catchError((error) => of(deleteUserFailure({ error }))),
        ),
      ),
    ),
  );

  logoutAfterUserDeleted$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUserSuccess),
      map(() => logout()),
    ),
  );
}
