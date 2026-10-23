import { ActionLogDetails } from '../action-logs/action-log-details.interface';
import { RewardClaimInfo } from '../reward-claims/reward-claim-info.interface';
import { UserDetails } from './user-details.interface';

/**
 * Interface representing user details including action logs and reward claims.
 */
export interface UserRepresentation extends UserDetails {
  rewardClaims: Array<RewardClaimInfo>;
  actionLogs: Array<ActionLogDetails>;
}
