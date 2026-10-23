import { UserRepresentation } from '@egofm-reward/shared';

export interface UserState {
  currentUser: UserRepresentation | null;
  loading: boolean;
  error: unknown;
  loaded: boolean;

  changePasswordLoading: boolean;
  changePasswordError: unknown;
  changePasswordSuccess: boolean;

  updateUserLoading: boolean;
  updateUserError: unknown;
  updateUserSuccess: boolean;
}

export const initialUserState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  loaded: false,

  changePasswordLoading: false,
  changePasswordError: null,
  changePasswordSuccess: false,

  updateUserLoading: false,
  updateUserError: null,
  updateUserSuccess: false,
};
