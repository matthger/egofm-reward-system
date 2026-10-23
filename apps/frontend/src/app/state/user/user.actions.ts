import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';

import { UpdateUser, UserDetails, UserRepresentation } from '@egofm-reward/shared';

export const loadCurrentUser = createAction('[User] Load Current User');
export const loadCurrentUserSuccess = createAction(
  '[User] Load Current User Success',
  props<{ user: UserRepresentation }>(),
);
export const loadCurrentUserFailure = createAction(
  '[User] Load Current User Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const changePassword = createAction(
  '[User] Change Password',
  props<{ id: string; oldPassword: string; password: string }>(),
);
export const changePasswordSuccess = createAction(
  '[User] Change Password Success',
  props<{ user: UserDetails }>(),
);
export const changePasswordFailure = createAction(
  '[User] Change Password Failure',
  props<{ error: string }>(),
);

export const updateUser = createAction(
  '[User] Update User',
  props<{ id: string; user: UpdateUser }>(),
);
export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ user: UserDetails }>(),
);
export const updateUserFailure = createAction(
  '[User] Update User Failure',
  props<{ error: string }>(),
);

export const deleteUser = createAction('[User] Delete User', props<{ id: string }>());
export const deleteUserSuccess = createAction('[User] Delete User Success');
export const deleteUserFailure = createAction(
  '[User] Delete User Failure',
  props<{ error: unknown }>(),
);
