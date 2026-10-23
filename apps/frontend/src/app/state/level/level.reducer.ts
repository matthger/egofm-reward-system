import { createReducer, on } from '@ngrx/store';

import {
  loadLevel,
  loadLevelFailure,
  loadLevels,
  loadLevelsFailure,
  loadLevelsSuccess,
  loadLevelSuccess,
} from './level.actions';
import { initialLevelState } from './level.models';

export const levelReducer = createReducer(
  initialLevelState,
  on(loadLevels, (state) => ({ ...state, loading: true, error: null })),
  on(loadLevelsSuccess, (state, { levels }) => ({ ...state, loading: false, levels })),
  on(loadLevelsFailure, (state, { error }) => ({ ...state, loading: false, error })),

  on(loadLevel, (state) => ({ ...state, loading: true, error: null })),
  on(loadLevelSuccess, (state, { level }) => ({ ...state, loading: false, selectedLevel: level })),
  on(loadLevelFailure, (state, { error }) => ({ ...state, loading: false, error })),
);
