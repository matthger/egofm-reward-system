import * as bcrypt from 'bcrypt';

import { Role } from '@egofm-reward/shared';

import { Level } from '../../resources/level/entities/level.entity';
import { User } from '../../resources/users/entities/user.entity';
import { findLevelOrFail } from '../utils/find-level-or-fail.util';

const seedUserPassword: string | undefined = process.env.SEEDUSER_PASSWORD;
const fallbackHash = '$2b$10$NVgLWYjwLsrmP2l1iD4va.Sy4SK513/177E8mt0lIJTw2/uUzYl2W';

export const userSeeds = async (levels: Array<Level>): Promise<Array<Partial<User>>> => [
  {
    email: 'listener@egofm.de',
    username: 'listener',
    passwordHash: seedUserPassword ? await bcrypt.hash(seedUserPassword, 10) : fallbackHash,
    points: 125,
    birthDate: new Date('1995-01-01'),
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
    currentStreak: 7,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24),
    level: findLevelOrFail(levels, 1),
  },
  {
    email: 'supporter@egofm.de',
    username: 'supporter',
    passwordHash: seedUserPassword ? await bcrypt.hash(seedUserPassword, 10) : fallbackHash,
    points: 595,
    birthDate: new Date('1990-06-15'),
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
    currentStreak: 7,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    level: findLevelOrFail(levels, 2),
  },
  {
    email: 'fan@egofm.de',
    username: 'fan',
    passwordHash: seedUserPassword ? await bcrypt.hash(seedUserPassword, 10) : fallbackHash,
    points: 2990,
    birthDate: new Date('1988-10-10'),
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    currentStreak: 7,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60),
    level: findLevelOrFail(levels, 3),
  },
  {
    email: 'insider@egofm.de',
    username: 'insider',
    passwordHash: seedUserPassword ? await bcrypt.hash(seedUserPassword, 10) : fallbackHash,
    points: 3375,
    birthDate: new Date('1992-03-22'),
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    currentStreak: 7,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    level: findLevelOrFail(levels, 4),
  },
  {
    email: 'diehard@egofm.de',
    username: 'diehard_ego',
    passwordHash: seedUserPassword ? await bcrypt.hash(seedUserPassword, 10) : fallbackHash,
    points: 5500,
    birthDate: new Date('1999-09-09'),
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
    currentStreak: 6,
    lastLogin: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
    level: findLevelOrFail(levels, 5),
  },
  {
    email: 'champion@egofm.de',
    username: 'champion',
    passwordHash: seedUserPassword ? await bcrypt.hash(seedUserPassword, 10) : fallbackHash,
    points: 8000,
    birthDate: new Date('1985-05-05'),
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    currentStreak: 10,
    lastLogin: new Date(Date.now() - 1000 * 60 * 10),
    level: findLevelOrFail(levels, 6),
  },
  {
    email: 'admin@egofm.de',
    username: 'admin',
    passwordHash: seedUserPassword ? await bcrypt.hash(seedUserPassword, 10) : fallbackHash,
    points: 0,
    birthDate: new Date('1985-05-05'),
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    currentStreak: 0,
    lastLogin: new Date(Date.now() - 1000 * 60 * 10),
    level: findLevelOrFail(levels, 6),
    role: Role.ADMIN,
  },
];
