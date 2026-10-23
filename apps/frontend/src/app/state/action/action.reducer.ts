import { createReducer, on } from '@ngrx/store';

import {
  loadActions,
  loadActionsSuccess,
  loadActionsFailure,
  loadAction,
  loadActionSuccess,
  loadActionFailure,
} from './action.actions';
import { initialActionState } from './action.models';

export const actionReducer = createReducer(
  initialActionState,
  on(loadActions, (state) => ({ ...state, loading: true, error: null })),
  on(loadActionsSuccess, (state, { actions }) => ({ ...state, loading: false, actions })),
  on(loadActionsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(loadAction, (state) => ({ ...state, loading: true, error: null })),
  on(loadActionSuccess, (state, { action }) => ({
    ...state,
    loading: false,
    selectedAction: action,
  })),
  on(loadActionFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
