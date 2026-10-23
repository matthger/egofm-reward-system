import { Role } from '../../enums/role.enum';

/**
 * Interface representing the structure of a JWT payload.
 */
export interface JwtPayload {
  sub: string;
  username: string;
  role: Role;
}
