import { ActionEnum } from '@egofm-reward/shared';

import { Action } from '../../resources/actions/entities/action.entity';

export const findActionOrFail = (actions: Array<Action>, name: ActionEnum): Action => {
  const action: Action | undefined = actions.find((a) => a.name === name);
  if (!action) throw new Error(`Action with name '${name}' not found.`);
  return action;
};
