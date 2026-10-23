import { createAction, props } from '@ngrx/store';

import { LevelInfo, LevelDetails } from '@egofm-reward/shared';

export const loadLevels = createAction('[Level] Load Levels');
export const loadLevelsSuccess = createAction(
  '[Level] Load Levels Success',
  props<{ levels: Array<LevelInfo> }>(),
);
export const loadLevelsFailure = createAction(
  '[Level] Load Levels Failure',
  props<{ error: unknown }>(),
);

export const loadLevel = createAction('[Level] Load Level', props<{ id: number }>());
export const loadLevelSuccess = createAction(
  '[Level] Load Level Success',
  props<{ level: LevelDetails }>(),
);
export const loadLevelFailure = createAction(
  '[Level] Load Level Failure',
  props<{ error: unknown }>(),
);
