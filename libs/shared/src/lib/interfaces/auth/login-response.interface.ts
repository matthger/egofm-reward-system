import { UserDetails } from '../users/user-details.interface';

/**
 * Interface representing the response structure for a user login.
 */
export interface LoginResponse {
  accessToken: string;
  user: Partial<UserDetails>;
}
