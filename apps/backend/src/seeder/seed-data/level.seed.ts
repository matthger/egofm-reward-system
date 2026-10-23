import { Level } from '../../resources/level/entities/level.entity';

export const levelSeeds: Array<Partial<Level>> = [
  {
    id: 1,
    name: 'Listener',
    imageUrl: 'assets/images/level/listener.png',
    minPoints: 0,
    maxPoints: 499,
  },
  {
    id: 2,
    name: 'Supporter',
    imageUrl: 'assets/images/level/supporter.png',
    minPoints: 500,
    maxPoints: 1499,
  },
  {
    id: 3,
    name: 'Fan',
    imageUrl: 'assets/images/level/fan.png',
    minPoints: 1500,
    maxPoints: 2999,
  },
  {
    id: 4,
    name: 'Insider',
    imageUrl: 'assets/images/level/insider.png',
    minPoints: 3000,
    maxPoints: 4999,
  },
  {
    id: 5,
    name: 'Die-Hard Ego',
    imageUrl: 'assets/images/level/diehard.png',
    minPoints: 5000,
    maxPoints: 7499,
  },
  {
    id: 6,
    name: 'Champion',
    imageUrl: 'assets/images/level/champion.png',
    minPoints: 7500,
    maxPoints: null,
  },
];
