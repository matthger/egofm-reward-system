import { RewardClaimStatus } from '@egofm-reward/shared';

export const RewardClaimStatusLabel: Record<RewardClaimStatus | string, string> = {
  ['']: 'Kein Status verfügbar',
  [RewardClaimStatus.PENDING]: 'Ausstehend',
  [RewardClaimStatus.SENT]: 'Versendet',
  [RewardClaimStatus.CANCELLED]: 'Storniert',
  [RewardClaimStatus.DECLINED]: 'Abgelehnt',
};
