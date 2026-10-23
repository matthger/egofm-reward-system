export interface ActionLogState {
  loading: boolean;
  error: unknown;
}

export const initialActionLogState: ActionLogState = {
  loading: false,
  error: null,
};
