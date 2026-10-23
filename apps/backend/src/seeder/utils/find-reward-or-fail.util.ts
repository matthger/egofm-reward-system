import { RewardEnum } from '@egofm-reward/shared';

import { Reward } from '../../resources/rewards/entities/reward.entity';

export const findRewardOrFail = (rewards: Array<Reward>, name: RewardEnum): Reward => {
  const reward: Reward | undefined = rewards.find((r) => r.name === name);
  if (!reward) throw new Error(`Reward with name '${name}' not found.`);
  return reward;
};
