import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DialogModule } from 'primeng/dialog';
import { ProgressBarModule } from 'primeng/progressbar';
import { Tooltip } from 'primeng/tooltip';
import { combineLatest, map, Observable } from 'rxjs';

import { LevelInfo, UserRepresentation } from '@egofm-reward/shared';

import { selectAllLevels } from '../../state/level/level.selector';
import { selectCurrentUser } from '../../state/user/user.selector';
import {
  compensateScrollbarShift,
  resetScrollbarCompensation,
} from '../../utils/scrollbar/scrollbar.utils';

interface LevelProgress {
  isMaxLevel: boolean;
  currentLevel?: LevelInfo;
  nextLevel?: LevelInfo;
  progress?: number;
  pointsToNextLevel?: number;
}

/**
 * Component for displaying the user's current level progress.
 */
@Component({
  selector: 'app-level-progress',
  standalone: true,
  imports: [ProgressBarModule, DialogModule, CommonModule, NgOptimizedImage, Tooltip],
  templateUrl: './level-progress.component.html',
  styleUrls: ['./level-progress.component.scss'],
})
export class LevelProgressComponent {
  @Input() showBarTitle!: boolean;
  @Input() showBarDescription!: boolean;

  progress$: Observable<LevelProgress | null>;
  levels$: Observable<Array<LevelInfo>>;
  currentUser$: Observable<UserRepresentation | null>;

  showLevelDialog = false;

  /**
   * LevelProgressComponent constructor
   *
   * @param {Store} store - The NgRx store for state management.
   */
  constructor(private readonly store: Store) {
    this.levels$ = this.store.select(selectAllLevels);
    this.currentUser$ = this.store.select(selectCurrentUser);

    this.progress$ = combineLatest([this.currentUser$, this.levels$]).pipe(
      map(([currentUser, levels]) => {
        if (!currentUser || !levels?.length) {
          return null;
        }

        const currentLevel = levels.find((l) => l.id === currentUser.levelId);
        const nextLevel = levels.find((l) => l.id === currentUser.levelId + 1);

        if (!currentLevel) {
          return null;
        }

        const isMaxLevel = !nextLevel || currentLevel.maxPoints === null;

        if (isMaxLevel) {
          return {
            isMaxLevel: true,
            currentLevel,
          };
        }

        const minPoints = currentLevel.minPoints;
        const maxPoints = nextLevel.minPoints;

        const clampedPoints = Math.max(minPoints, Math.min(currentUser.points, maxPoints));
        const progressPercent = ((clampedPoints - minPoints) / (maxPoints - minPoints)) * 100;

        const pointsToNextLevel = maxPoints - currentUser.points;

        return {
          isMaxLevel: false,
          currentLevel,
          nextLevel,
          progress: Math.round(progressPercent),
          pointsToNextLevel: Math.max(pointsToNextLevel, 0),
        };
      }),
    );
  }

  /**
   * Toggles the level overview dialog.
   */
  toggleLevelDialog(): void {
    this.showLevelDialog = !this.showLevelDialog;
    compensateScrollbarShift();
  }

  /**
   * Handles the event when the level dialog is closed.
   */
  onDialogHide(): void {
    resetScrollbarCompensation();
    this.showLevelDialog = false;
  }
}
