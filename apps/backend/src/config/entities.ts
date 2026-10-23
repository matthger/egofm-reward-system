import { ActionLog } from '../resources/action-logs/entities/action-log.entity';
import { Action } from '../resources/actions/entities/action.entity';
import { Level } from '../resources/level/entities/level.entity';
import { RewardClaim } from '../resources/reward-claims/entities/reward-claim.entity';
import { Reward } from '../resources/rewards/entities/reward.entity';
import { User } from '../resources/users/entities/user.entity';

export const entities = [ActionLog, Action, Level, RewardClaim, Reward, User];
