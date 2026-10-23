import { ActionInfo, ActionDetails } from '@egofm-reward/shared';

export interface ActionState {
  actions: Array<ActionInfo>;
  selectedAction: ActionDetails | null;
  loading: boolean;
  error: unknown;
}

export const initialActionState: ActionState = {
  actions: [],
  selectedAction: null,
  loading: false,
  error: null,
};
