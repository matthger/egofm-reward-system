import { RewardClaimStatus, RewardEnum } from '@egofm-reward/shared';

import { Level } from '../../resources/level/entities/level.entity';
import { RewardClaim } from '../../resources/reward-claims/entities/reward-claim.entity';
import { Reward } from '../../resources/rewards/entities/reward.entity';
import { User } from '../../resources/users/entities/user.entity';
import { findLevelOrFail } from '../utils/find-level-or-fail.util';
import { findRewardOrFail } from '../utils/find-reward-or-fail.util';
import { findUserOrFail } from '../utils/find-user-or-fail.util';

export const rewardClaimSeeds = (
  levels: Array<Level>,
  users: Array<User>,
  rewards: Array<Reward>,
): Array<Partial<RewardClaim>> => [
  {
    user: findUserOrFail(users, 'supporter'),
    reward: findRewardOrFail(rewards, RewardEnum.STICKER_SET),
    level: findLevelOrFail(levels, 2),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
    status: RewardClaimStatus.SENT,
  },
  {
    user: findUserOrFail(users, 'fan'),
    reward: findRewardOrFail(rewards, RewardEnum.SPOTIFY_PLAYLIST),
    level: findLevelOrFail(levels, 2),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
    status: RewardClaimStatus.SENT,
  },
  {
    user: findUserOrFail(users, 'fan'),
    reward: findRewardOrFail(rewards, RewardEnum.SONG_REQUEST),
    level: findLevelOrFail(levels, 3),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    status: RewardClaimStatus.SENT,
  },
  {
    user: findUserOrFail(users, 'insider'),
    reward: findRewardOrFail(rewards, RewardEnum.WALLPAPER),
    level: findLevelOrFail(levels, 2),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    status: RewardClaimStatus.SENT,
  },
  {
    user: findUserOrFail(users, 'insider'),
    reward: findRewardOrFail(rewards, RewardEnum.EVENT_DISCOUNT),
    level: findLevelOrFail(levels, 3),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    status: RewardClaimStatus.SENT,
  },
  {
    user: findUserOrFail(users, 'insider'),
    reward: findRewardOrFail(rewards, RewardEnum.STREAM_AD_FREE),
    level: findLevelOrFail(levels, 4),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
    status: RewardClaimStatus.PENDING,
  },
  {
    user: findUserOrFail(users, 'diehard_ego'),
    reward: findRewardOrFail(rewards, RewardEnum.STREAM_SHOUTOUT),
    level: findLevelOrFail(levels, 2),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    status: RewardClaimStatus.SENT,
  },
  {
    user: findUserOrFail(users, 'diehard_ego'),
    reward: findRewardOrFail(rewards, RewardEnum.BTS_CONTENT),
    level: findLevelOrFail(levels, 3),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    status: RewardClaimStatus.SENT,
  },
  {
    user: findUserOrFail(users, 'diehard_ego'),
    reward: findRewardOrFail(rewards, RewardEnum.MERCH_DISCOUNT),
    level: findLevelOrFail(levels, 4),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 9),
    status: RewardClaimStatus.DECLINED,
  },
  {
    user: findUserOrFail(users, 'diehard_ego'),
    reward: findRewardOrFail(rewards, RewardEnum.SIGNED_CARD),
    level: findLevelOrFail(levels, 5),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    status: RewardClaimStatus.SENT,
  },
  {
    user: findUserOrFail(users, 'champion'),
    reward: findRewardOrFail(rewards, RewardEnum.MINI_DRAW),
    level: findLevelOrFail(levels, 2),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    status: RewardClaimStatus.SENT,
  },
  {
    user: findUserOrFail(users, 'champion'),
    reward: findRewardOrFail(rewards, RewardEnum.SONG_REQUEST),
    level: findLevelOrFail(levels, 3),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25),
    status: RewardClaimStatus.SENT,
  },
  {
    user: findUserOrFail(users, 'champion'),
    reward: findRewardOrFail(rewards, RewardEnum.PRESALE_ACCESS),
    level: findLevelOrFail(levels, 4),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
    status: RewardClaimStatus.SENT,
  },
  {
    user: findUserOrFail(users, 'champion'),
    reward: findRewardOrFail(rewards, RewardEnum.MINI_MERCH),
    level: findLevelOrFail(levels, 5),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
    status: RewardClaimStatus.SENT,
  },
  {
    user: findUserOrFail(users, 'champion'),
    reward: findRewardOrFail(rewards, RewardEnum.CHAMPION_MERCH),
    level: findLevelOrFail(levels, 6),
    claimedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    status: RewardClaimStatus.SENT,
  },
];
