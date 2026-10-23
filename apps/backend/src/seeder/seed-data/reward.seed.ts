import { RewardEnum } from '@egofm-reward/shared';

import { Level } from '../../resources/level/entities/level.entity';
import { Reward } from '../../resources/rewards/entities/reward.entity';
import { findLevelOrFail } from '../utils/find-level-or-fail.util';

export const rewardSeeds = (levels: Array<Level>): Array<Partial<Reward>> => [
  // Supporter (Level ID 2)
  {
    name: RewardEnum.MINI_DRAW,
    title: 'Mini-Verlosung Teilnahme',
    description: 'Teilnahme an exklusiven Mini-Gewinnspielen, wenn ein Event ansteht.',
    imageUrl: 'assets/badges/mini_verlosung.jpg',
    isActive: true,
    isAutomated: false,
    level: findLevelOrFail(levels, 2),
  },
  {
    name: RewardEnum.WALLPAPER,
    title: 'Digitales Wallpaper',
    description: 'Exklusives Wallpaper für PC oder Handy.',
    imageUrl: '',
    isActive: true,
    isAutomated: true,
    level: findLevelOrFail(levels, 2),
  },
  {
    name: RewardEnum.STICKER_SET,
    title: 'egoFM-Sticker-Set',
    description: 'Verschiedene egoFM-Sticker zum Sammeln oder Verschenken.',
    imageUrl: '',
    isActive: true,
    isAutomated: false,
    level: findLevelOrFail(levels, 2),
  },
  {
    name: RewardEnum.SPOTIFY_PLAYLIST,
    title: 'Spotify-Playlist Zugang',
    description: 'Zugang zu einer exklusiven egoFM-Spotify-Playlist.',
    imageUrl: '',
    isActive: true,
    isAutomated: true,
    level: findLevelOrFail(levels, 2),
  },
  {
    name: RewardEnum.STREAM_SHOUTOUT,
    title: 'Shoutout im Stream',
    description: 'Dein Name oder Gruß wird im Live-Stream erwähnt.',
    imageUrl: '',
    isActive: true,
    isAutomated: false,
    level: findLevelOrFail(levels, 2),
  },

  // Fan (Level ID 3)
  {
    name: RewardEnum.SONG_REQUEST,
    title: 'Songwunsch',
    description: 'Du darfst einen Song im Programm wünschen.',
    imageUrl: 'assets/badges/songwunsch.jpg',
    isActive: true,
    isAutomated: false,
    level: findLevelOrFail(levels, 3),
  },
  {
    name: RewardEnum.EVENT_DISCOUNT,
    title: 'Event-Rabatt',
    description: 'Kleiner Rabatt auf Tickets zu egoFM-Events (sofern verfügbar).',
    imageUrl: '',
    isActive: true,
    isAutomated: false,
    level: findLevelOrFail(levels, 3),
  },
  {
    name: RewardEnum.BTS_CONTENT,
    title: 'Behind-the-Scenes Content',
    description: 'Ein exklusives Video oder Einblick hinter die Kulissen von egoFM.',
    imageUrl: '',
    isActive: true,
    isAutomated: true,
    level: findLevelOrFail(levels, 3),
  },

  // Insider (Level ID 4)
  {
    name: RewardEnum.STREAM_AD_FREE,
    title: 'Werbefreier Stream (1 Monat)',
    description: 'Zugang zum egoFM-Stream ohne Werbung für 1 Monat.',
    imageUrl: '',
    isActive: true,
    isAutomated: true,
    level: findLevelOrFail(levels, 4),
  },
  {
    name: RewardEnum.PRESALE_ACCESS,
    title: 'Vorverkaufs-Zugang',
    description: 'Früherer Zugang zu Tickets für egoFM-Events.',
    imageUrl: '',
    isActive: true,
    isAutomated: false,
    level: findLevelOrFail(levels, 4),
  },
  {
    name: RewardEnum.MERCH_DISCOUNT,
    title: 'Merch-Rabatt',
    description: 'Rabatt auf bestimmte Artikel im egoFM-Shop.',
    imageUrl: '',
    isActive: true,
    isAutomated: false,
    level: findLevelOrFail(levels, 4),
  },
  {
    name: RewardEnum.LIVE_QUIZ,
    title: 'Live-Quiz Einladung',
    description: 'Telefonisches Live-Quiz mit Gewinnmöglichkeit im Stream.',
    imageUrl: '',
    isActive: true,
    isAutomated: false,
    level: findLevelOrFail(levels, 4),
  },

  // Die-Hard Ego (Level ID 5)
  {
    name: RewardEnum.MINI_MERCH,
    title: 'Limitierter Mini-Merch',
    description:
      'Spezialartikel wie Schlüsselanhänger, Sticker, Flaschenöffner, Tasse – limitiert & exklusiv.',
    imageUrl: '',
    isActive: true,
    isAutomated: false,
    level: findLevelOrFail(levels, 5),
  },
  {
    name: RewardEnum.SIGNED_CARD,
    title: 'Handsignierte Postkarte',
    description: 'Eine Postkarte, handsigniert vom egoFM-Team.',
    imageUrl: '',
    isActive: true,
    isAutomated: false,
    level: findLevelOrFail(levels, 5),
  },

  // Champion (Level ID 6)
  {
    name: RewardEnum.GUESTLIST_CONTEST,
    title: 'Gästeliste-Gewinnspiel',
    description: 'Exklusives Gewinnspiel für Gästelistenplätze bei Konzerten oder Events.',
    imageUrl: '',
    isActive: true,
    isAutomated: false,
    level: findLevelOrFail(levels, 6),
  },
  {
    name: RewardEnum.MEET_AND_GREET,
    title: 'Meet & Greet',
    description: 'Treffen mit Moderator*innen oder Bands (wenn möglich).',
    imageUrl: '',
    isActive: true,
    isAutomated: false,
    level: findLevelOrFail(levels, 6),
  },
  {
    name: RewardEnum.CHAMPION_MERCH,
    title: 'Limitierter Champion-Merch',
    description: 'T-Shirt, Cap oder andere exklusive Artikel nur für Champions.',
    imageUrl: '',
    isActive: true,
    isAutomated: false,
    level: findLevelOrFail(levels, 6),
  },
];
