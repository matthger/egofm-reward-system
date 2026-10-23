import { createAction, props } from '@ngrx/store';

import { CreateActionLog, LevelDetails, UpdateActionLog } from '@egofm-reward/shared';

export const createActionLog = createAction(
  '[ActionLog] Create Action Log',
  props<{ payload: CreateActionLog }>(),
);
export const createActionLogSuccess = createAction('[ActionLog] Create Action Log Success');
export const createActionLogFailure = createAction(
  '[ActionLog] Create Action Log Failure',
  props<{ error: unknown }>(),
);

export const updateActionLog = createAction(
  '[ActionLog] Update Action Log',
  props<{ id: string; payload: UpdateActionLog }>(),
);
export const updateActionLogSuccess = createAction(
  '[ActionLog] Update Action Log Success',
  props<{ leveledUp: boolean; newLevel?: LevelDetails }>(),
);
export const updateActionLogFailure = createAction(
  '[ActionLog] Update Action Log Failure',
  props<{ error: unknown }>(),
);
