import { RewardClaimStatus } from '../../enums/reward-claim-status.enum';

/**
 * Interface for creating a reward claim.
 */
export interface CreateRewardClaim {
  userId: string;
  rewardId: string;
  levelId?: string;
  status?: RewardClaimStatus;
}
