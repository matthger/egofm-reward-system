import { createAction, props } from '@ngrx/store';

import { CreateUser, Login, LoginResponse, UserDetails } from '@egofm-reward/shared';

export const setAuthState = createAction(
  '[Auth] Set Auth State From User',
  props<{
    user: Partial<UserDetails>;
    token: string;
  }>(),
);

export const login = createAction('[Auth] Login', props<{ credentials: Login }>());
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: LoginResponse }>(),
);
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: unknown }>());
export const logout = createAction('[Auth] Logout');

export const register = createAction('[Auth] Register', props<{ user: CreateUser }>());
export const registerSuccess = createAction('[Auth] Register Success');
export const registerFailure = createAction('[Auth] Register Failure', props<{ error: unknown }>());
