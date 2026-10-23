import { createReducer, on } from '@ngrx/store';

import {
  login,
  loginFailure,
  loginSuccess,
  logout,
  register,
  registerFailure,
  registerSuccess,
  setAuthState,
} from './auth.actions';
import { initialAuthState } from './auth.models';

export const authReducer = createReducer(
  initialAuthState,
  on(setAuthState, (state, { user, token }) => ({
    ...state,
    user,
    token,
    loading: false,
    error: null,
  })),
  on(login, (state) => ({ ...state, loading: true, error: null })),
  on(loginSuccess, (state, { response }) => ({
    ...state,
    loading: false,
    user: response.user,
    token: response.accessToken,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(logout, () => initialAuthState),
  on(register, (state) => ({
    ...state,
    registerSuccess: false,
    registerError: null,
  })),
  on(registerSuccess, (state) => ({
    ...state,
    registerSuccess: true,
    registerError: null,
  })),
  on(registerFailure, (state, { error }) => ({
    ...state,
    registerSuccess: false,
    registerError: error,
  })),
);
