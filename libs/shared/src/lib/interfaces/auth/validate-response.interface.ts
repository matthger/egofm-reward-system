import { Role } from '../../enums/role.enum';

/**
 * Interface representing the structure of the response for user validation.
 */
export interface ValidateResponse {
  userId: string;
  username: string;
  role: Role;
}
