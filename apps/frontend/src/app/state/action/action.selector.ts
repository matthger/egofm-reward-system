import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ActionState } from './action.models';

export const selectActionState = createFeatureSelector<ActionState>('action');

export const selectAllActions = createSelector(selectActionState, (state) => state.actions);
export const selectSelectedAction = createSelector(
  selectActionState,
  (state) => state.selectedAction,
);
export const selectActionLoading = createSelector(selectActionState, (state) => state.loading);
export const selectActionError = createSelector(selectActionState, (state) => state.error);
