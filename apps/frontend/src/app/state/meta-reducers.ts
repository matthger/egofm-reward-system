import { ActionReducer, MetaReducer } from '@ngrx/store';

import { AppState } from './app.reducers';
import { logout } from './auth/auth.actions';

/**
 * Reducer to clear app state after logout is called
 *
 * @param {ActionReducer<unknown>} reducer - The App reducer
 * @returns {ActionReducer<unknown>} The updated app reducer
 */
export function clearStateMetaReducer(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function (state, action) {
    if (action.type === logout.type) {
      return reducer(
        {
          leaderboard: state?.leaderboard,
        } as AppState,
        { type: '@@INIT' },
      );
    }
    return reducer(state, action);
  };
}

export const metaReducers: Array<MetaReducer<AppState>> = [clearStateMetaReducer];
