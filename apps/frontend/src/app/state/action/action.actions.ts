import { createAction, props } from '@ngrx/store';

import { ActionInfo, ActionDetails } from '@egofm-reward/shared';

export const loadActions = createAction('[Action] Load Actions');
export const loadActionsSuccess = createAction(
  '[Action] Load Actions Success',
  props<{ actions: Array<ActionInfo> }>(),
);
export const loadActionsFailure = createAction(
  '[Action] Load Actions Failure',
  props<{ error: unknown }>(),
);

export const loadAction = createAction('[Action] Load Action', props<{ id: string }>());
export const loadActionSuccess = createAction(
  '[Action] Load Action Success',
  props<{ action: ActionDetails }>(),
);
export const loadActionFailure = createAction(
  '[Action] Load Action Failure',
  props<{ error: unknown }>(),
);
