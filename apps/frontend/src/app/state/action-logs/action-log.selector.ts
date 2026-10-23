import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ActionLogState } from './action-log.models';

export const selectActionLogState = createFeatureSelector<ActionLogState>('actionLog');

export const selectActionLogLoading = createSelector(
  selectActionLogState,
  (state) => state.loading,
);
