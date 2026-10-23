/**
 * Interface for creating a new user.
 */
export interface CreateUser {
  email: string;
  username: string;
  password: string;
  birthDate?: string;
}
