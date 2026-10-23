import { createReducer, on } from '@ngrx/store';

import {
  createActionLog,
  createActionLogFailure,
  createActionLogSuccess,
  updateActionLog,
  updateActionLogFailure,
  updateActionLogSuccess,
} from './action-log.actions';
import { initialActionLogState } from './action-log.models';

export const actionLogReducer = createReducer(
  initialActionLogState,
  on(createActionLog, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(createActionLogSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(createActionLogFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(updateActionLog, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(updateActionLogSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(updateActionLogFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
);
