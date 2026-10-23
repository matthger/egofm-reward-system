import { createReducer, on } from '@ngrx/store';

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
import { initialUserState } from './user.models';

export const userReducer = createReducer(
  initialUserState,
  on(loadCurrentUser, (state) => ({
    ...state,
    loading: true,
    error: null,
    loaded: false,
  })),
  on(loadCurrentUserSuccess, (state, { user }) => ({
    ...state,
    currentUser: user,
    loading: false,
    loaded: true,
  })),
  on(loadCurrentUserFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    loaded: false,
  })),
  on(changePassword, (state) => ({
    ...state,
    changePasswordLoading: true,
    changePasswordError: null,
    changePasswordSuccess: false,
  })),
  on(changePasswordSuccess, (state) => ({
    ...state,
    changePasswordSuccess: true,
    changePasswordLoading: false,
  })),
  on(changePasswordFailure, (state, { error }) => ({
    ...state,
    changePasswordLoading: false,
    changePasswordError: error,
    changePasswordSuccess: false,
  })),
  on(updateUser, (state) => ({
    ...state,
    updateUserLoading: true,
    updateUserError: null,
    updateUserSuccess: false,
  })),
  on(updateUserSuccess, (state) => ({
    ...state,
    updateUserSuccess: true,
    updateUserLoading: false,
  })),
  on(updateUserFailure, (state, { error }) => ({
    ...state,
    updateUserLoading: false,
    updateUserError: error,
    updateUserSuccess: false,
  })),
  on(deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(deleteUserSuccess, (state) => ({
    ...state,
    currentUser: null,
    loaded: false,
    loading: false,
    error: null,
  })),
  on(deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
