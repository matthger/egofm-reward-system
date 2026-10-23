import { LevelDetails, LevelInfo } from '@egofm-reward/shared';

export interface LevelState {
  levels: Array<LevelInfo>;
  selectedLevel: LevelDetails | null;
  loading: boolean;
  error: unknown;
}

export const initialLevelState: LevelState = {
  levels: [],
  selectedLevel: null,
  loading: false,
  error: null,
};
