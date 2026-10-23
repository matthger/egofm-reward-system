import { ActionLogMetadata } from '@egofm-reward/shared';

export const actionMetadataLabel: Record<keyof ActionLogMetadata, string> = {
  platform: 'Plattform',
  streamHours: 'Gehörte Stunden',
  amount: 'Betrag',
  invitedEmail: 'Eingeladene E-Mail',
  reviewPlatform: 'Bewertungsplattform',
};
