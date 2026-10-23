import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { map, Observable } from 'rxjs';

import { selectCurrentUser } from '../../state/user/user.selector';

const STREAK_BASE_REWARDS = [
  { threshold: 3, points: 25 },
  { threshold: 7, points: 50 },
  { threshold: 14, points: 100 },
];

const REPEAT_AFTER_DAYS = 7;
const REPEAT_REWARD = 100;

interface StreakInfo {
  currentStreak: number;
  currentReward: number;
  nextThreshold?: number;
  nextReward?: number;
  daysCompletedInCurrentCycle: number;
}

/**
 * Displays the user's current streak, rewards, and progress towards the next reward.
 */
@Component({
  selector: 'app-streak',
  standalone: true,
  imports: [CommonModule, CardModule, AvatarModule],
  templateUrl: './streak.component.html',
  styleUrls: ['./streak.component.scss'],
})
export class StreakComponent {
  streakInfo$: Observable<StreakInfo>;

  /**
   * StreakComponent constructor
   *
   * @param {Store} store The NgRx store instance.
   */
  constructor(private readonly store: Store) {
    this.streakInfo$ = this.store.select(selectCurrentUser).pipe(
      map((user) => {
        const currentStreak = user?.currentStreak ?? 0;

        let currentReward = 0;
        let nextThreshold: number | undefined;
        let nextReward: number | undefined;

        for (const reward of STREAK_BASE_REWARDS) {
          if (currentStreak >= reward.threshold) {
            currentReward = reward.points;
          } else {
            nextThreshold = reward.threshold;
            nextReward = reward.points;
            break;
          }
        }

        if (!nextThreshold) {
          const lastBase = STREAK_BASE_REWARDS[STREAK_BASE_REWARDS.length - 1];
          if (lastBase) {
            const cyclesSinceLastBase = Math.floor(
              (currentStreak - lastBase.threshold) / REPEAT_AFTER_DAYS,
            );
            currentReward = REPEAT_REWARD;
            nextThreshold = lastBase.threshold + (cyclesSinceLastBase + 1) * REPEAT_AFTER_DAYS;
            nextReward = REPEAT_REWARD;
          }
        }

        const daysCompletedInCurrentCycle = Math.min(currentStreak, nextThreshold ?? currentStreak);

        return {
          currentStreak,
          currentReward,
          nextThreshold,
          nextReward,
          daysCompletedInCurrentCycle,
        };
      }),
    );
  }

  /**
   * Calculates the number of days completed in the current reward cycle.
   *
   * @param {StreakInfo} streak The current streak information.
   * @returns {number} The number of days completed in the current cycle.
   */
  getStreakProgressInCycle(streak: StreakInfo): number {
    const cycleLength = 7;
    if (!streak.nextThreshold) {
      return cycleLength;
    }

    const lastThreshold = streak.nextThreshold - cycleLength;
    return lastThreshold >= 0 ? streak.currentStreak - lastThreshold : streak.currentStreak;
  }

  /**
   * Calculates the total reward points earned for the given streak.
   *
   * @param {number} currentStreak The current streak count.
   * @returns {number} The total reward points earned.
   */
  getTotalReward(currentStreak: number): number {
    let total = 0;

    for (const reward of STREAK_BASE_REWARDS) {
      if (currentStreak >= reward.threshold) {
        total += reward.points;
      } else {
        break;
      }
    }

    const lastBase = STREAK_BASE_REWARDS[STREAK_BASE_REWARDS.length - 1];
    if (currentStreak > lastBase.threshold) {
      const extraCycles = Math.floor((currentStreak - lastBase.threshold) / REPEAT_AFTER_DAYS);
      total += extraCycles * REPEAT_REWARD;
    }

    return total;
  }
}
