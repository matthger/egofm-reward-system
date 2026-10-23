import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import confetti from 'canvas-confetti';
import { Avatar } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Tooltip } from 'primeng/tooltip';
import { combineLatest, map, Observable } from 'rxjs';

import { LevelDetails, RewardClaimStatus, RewardInfo } from '@egofm-reward/shared';

import { selectAllRewards } from '../../state/reward/reward.selector';
import { createRewardClaim } from '../../state/reward-claims/reward-claim.actions';
import { selectCurrentUser } from '../../state/user/user.selector';
import {
  compensateScrollbarShift,
  resetScrollbarCompensation,
} from '../../utils/scrollbar/scrollbar.utils';

/**
 * Dialog component shown after a level up.
 */
@Component({
  selector: 'app-level-up-dialog',
  standalone: true,
  imports: [CommonModule, DynamicDialogModule, ButtonModule, NgOptimizedImage, Avatar, Tooltip],
  templateUrl: './level-up-dialog.component.html',
  styleUrls: ['./level-up-dialog.component.scss'],
})
export class LevelUpDialogComponent implements OnInit {
  newLevel: LevelDetails;
  availableRewards$: Observable<Array<RewardInfo>>;
  selectedReward?: RewardInfo;
  userId?: string;
  showAnimation: boolean;

  /**
   * Creates a new LevelUpDialogComponent.
   *
   * @param {DynamicDialogRef} dialogRef - Reference to the dialog for controlling it (e.g. closing).
   * @param {DynamicDialogConfig} dialogConfig - Dialog configuration and data (contains the new level).
   * @param {Store} store - NgRx store for state management and actions.
   */
  constructor(
    private readonly dialogRef: DynamicDialogRef,
    private readonly dialogConfig: DynamicDialogConfig,
    private readonly store: Store,
  ) {
    this.newLevel = this.dialogConfig.data.level;
    this.showAnimation = this.dialogConfig.data.showAnimation;

    this.availableRewards$ = combineLatest([
      this.store.select(selectAllRewards),
      this.store.select(selectCurrentUser),
    ]).pipe(
      map(([rewards, user]) => {
        if (!rewards?.length || !user) {
          return [];
        }

        this.userId = user.id;

        const claimedIds = new Set(user.rewardClaims.map((claim) => claim.rewardId));
        const eligible = rewards.filter(
          (reward) => reward.levelId <= this.newLevel.id && !claimedIds.has(reward.id),
        );

        return this.getDeterministicRandomRewards(eligible, user.id + this.newLevel.id, 2);
      }),
    );
  }

  /**
   * Initializes the component, compensates the scrollbar, and starts the confetti animation.
   */
  ngOnInit(): void {
    compensateScrollbarShift();

    if (this.showAnimation) {
      this.launchConfetti();
    }
  }

  /**
   * Returns a deterministic pseudo-random number based on a seed.
   *
   * @param {number} seed - The seed value.
   * @returns {number} A pseudo-random number between 0 (inclusive) and 1 (exclusive).
   */
  seededRandom(seed: number): number {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Returns a deterministic selection of random rewards based on a seed string.
   *
   * @param {Array<RewardInfo>} rewards - The list of eligible rewards.
   * @param {string} seedStr - The seed string to ensure deterministic shuffling.
   * @param {number} count - The number of rewards to select.
   * @returns {Array<RewardInfo>} The selected random rewards.
   */
  getDeterministicRandomRewards(
    rewards: Array<RewardInfo>,
    seedStr: string,
    count: number,
  ): Array<RewardInfo> {
    const seed = Array.from(seedStr).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const shuffled = [...rewards];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(this.seededRandom(seed + i) * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled.slice(0, count);
  }

  /**
   * Sets the currently selected reward.
   *
   * @param {RewardInfo} reward - The reward selected by the user.
   */
  selectReward(reward: RewardInfo): void {
    this.selectedReward = reward;
  }

  /**
   * Confirms the reward selection, creates a reward claim, and closes the dialog.
   */
  confirmSelection(): void {
    if (!this.selectedReward || !this.userId) return;

    this.store.dispatch(
      createRewardClaim({
        payload: {
          userId: this.userId,
          rewardId: this.selectedReward.id,
          levelId: String(this.newLevel.id),
          status: RewardClaimStatus.PENDING,
        },
      }),
    );

    this.dialogRef.close();
    resetScrollbarCompensation();
  }

  /**
   * Returns the points range for the current level as a string.
   *
   * @returns {string} The points range (e.g. "100 – 200" or "ab 300").
   */
  getPointsRange(): string {
    const { minPoints, maxPoints } = this.newLevel;
    return maxPoints !== null ? `${minPoints} – ${maxPoints}` : `ab ${minPoints}`;
  }

  /**
   * Returns the badge image URL for a reward.
   *
   * @param {RewardInfo} reward - The reward for which the image URL is needed.
   * @returns {string} The image URL or a default image if not available.
   */
  getBadgeImageUrl(reward: RewardInfo): string {
    return reward.imageUrl !== '' ? reward.imageUrl : 'assets/badges/badge.png';
  }

  /**
   * Starts a confetti animation for a certain duration.
   *
   * @private
   */
  private launchConfetti(): void {
    const duration = 10 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors: ['#95c02b', '#ffffff', '#f0f0f0'],
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random() * (0.3 - 0.1) + 0.1, y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: Math.random() * (0.9 - 0.7) + 0.7, y: Math.random() - 0.2 },
      });
    }, 250);
  }
}
