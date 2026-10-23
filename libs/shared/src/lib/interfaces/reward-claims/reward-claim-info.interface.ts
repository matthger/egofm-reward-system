import { RewardClaimStatus } from '../../enums/reward-claim-status.enum';

/**
 * The RewardClaimInfo interface represents the information about a reward claim.
 */
export interface RewardClaimInfo {
  id: string;
  userId: string;
  rewardId: string;
  levelId: number;
  claimedAt: Date;
  status?: RewardClaimStatus;
}
