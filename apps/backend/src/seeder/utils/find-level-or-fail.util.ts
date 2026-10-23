import { Level } from '../../resources/level/entities/level.entity';

export const findLevelOrFail = (levels: Array<Level>, id: number): Level => {
  const level: Level | undefined = levels.find((lvl) => lvl.id === id);
  if (!level) {
    throw new Error(`Level with id ${id} not found`);
  }
  return level;
};
