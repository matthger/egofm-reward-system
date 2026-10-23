import { UserDetails } from '@egofm-reward/shared';

export interface AuthState {
  user: Partial<UserDetails> | null;
  token: string | null;
  loading: boolean;
  error: unknown;
  registerSuccess: boolean;
  registerError: unknown | null;
}

export const initialAuthState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  registerSuccess: false,
  registerError: null,
};
