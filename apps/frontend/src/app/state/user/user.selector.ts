import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UserState } from './user.models';

export const selectUsersState = createFeatureSelector<UserState>('user');

export const selectCurrentUser = createSelector(selectUsersState, (state) => state.currentUser);
export const selectUserLoading = createSelector(selectUsersState, (state) => state.loading);
export const selectUserError = createSelector(selectUsersState, (state) => state.error);

export const selectChangePasswordLoading = createSelector(
  selectUsersState,
  (state) => state.changePasswordLoading,
);
export const selectChangePasswordSuccess = createSelector(
  selectUsersState,
  (state) => state.changePasswordSuccess,
);
export const selectChangePasswordError = createSelector(
  selectUsersState,
  (state) => state.changePasswordError,
);

export const selectUpdateUserLoading = createSelector(
  selectUsersState,
  (state) => state.updateUserLoading,
);
export const selectUpdateUserSuccess = createSelector(
  selectUsersState,
  (state) => state.updateUserSuccess,
);
export const selectUpdateUserError = createSelector(
  selectUsersState,
  (state) => state.updateUserError,
);
