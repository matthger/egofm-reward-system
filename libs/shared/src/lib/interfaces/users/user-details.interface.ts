import { UserInfo } from './user-info.interface';
import { Role } from '../../enums/role.enum';

/**
 * Interface for user details, extending basic user information.
 */
export interface UserDetails extends UserInfo {
  role: Role;
  birthDate?: Date;
  currentStreak: number;
  points: number;
  levelId: number;
  lastLogin?: Date;
}
