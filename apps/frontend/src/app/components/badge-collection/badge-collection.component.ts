import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { Divider } from 'primeng/divider';
import { Message } from 'primeng/message';
import { combineLatest, map, Observable } from 'rxjs';

import { LevelInfo, RewardClaimInfo, RewardInfo, UserRepresentation } from '@egofm-reward/shared';

import { selectAllLevels } from '../../state/level/level.selector';
import { selectAllRewards, selectRewardLoading } from '../../state/reward/reward.selector';
import { selectCurrentUser } from '../../state/user/user.selector';
import { RewardClaimStatusLabel } from '../../utils/labels/reward-claim-status-label.const';
import {
  compensateScrollbarShift,
  resetScrollbarCompensation,
} from '../../utils/scrollbar/scrollbar.utils';

/**
 * Component for displaying the user's earned and locked badge collection.
 */
@Component({
  selector: 'app-badge-collection',
  standalone: true,
  imports: [CommonModule, CardModule, AvatarModule, DialogModule, Divider, Message],
  templateUrl: './badge-collection.component.html',
  styleUrls: ['./badge-collection.component.scss'],
})
export class BadgeCollectionComponent {
  protected readonly RewardClaimStatusLabel = RewardClaimStatusLabel;

  earnedBadges$: Observable<Array<RewardInfo>>;
  lockedBadges$: Observable<Array<RewardInfo>>;
  levels$: Observable<Array<LevelInfo>>;
  currentUser$: Observable<UserRepresentation | null>;
  isRewardLoading$: Observable<boolean>;

  showBadgeDialog = false;
  selectedBadge: RewardInfo | null = null;
  isEarned = false;

  /**
   * BadgeCollectionComponent constructor
   *
   * @param {Store} store - The NgRx store for state management.
   */
  constructor(private readonly store: Store) {
    const currentUser$ = this.store.select(selectCurrentUser);
    const rewards$ = this.store.select(selectAllRewards);
    this.levels$ = this.store.select(selectAllLevels);
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.isRewardLoading$ = this.store.select(selectRewardLoading);

    const badges$ = combineLatest([currentUser$, rewards$]).pipe(
      map(([currentUser, rewards]) => {
        if (!currentUser || !rewards?.length) {
          return { earned: [], locked: [] };
        }

        const availableRewards = rewards
          .filter((r) => r.levelId <= currentUser.levelId)
          .sort((a, b) => a.levelId - b.levelId);

        const claimedIds = new Set(currentUser.rewardClaims.map((rc) => rc.rewardId));

        const earned = availableRewards.filter((r) => claimedIds.has(r.id));
        const locked = availableRewards.filter((r) => !claimedIds.has(r.id));

        return { earned, locked };
      }),
    );

    this.earnedBadges$ = badges$.pipe(map((result) => result.earned));
    this.lockedBadges$ = badges$.pipe(map((result) => result.locked));
  }

  /**
   * Opens the badge dialog for the selected badge.
   *
   * @param {RewardInfo} badge - The badge to display in the dialog.
   * @param {boolean} isEarned - Indicates if the badge is already earned.
   */
  openBadgeDialog(badge: RewardInfo, isEarned: boolean): void {
    this.selectedBadge = badge;
    this.isEarned = isEarned;
    this.showBadgeDialog = true;
    compensateScrollbarShift();
  }

  /**
   * Handles the event when the badge dialog is closed.
   */
  onDialogHide(): void {
    resetScrollbarCompensation();
    this.showBadgeDialog = false;
    this.selectedBadge = null;
  }

  /**
   * Finds the level name for the selected badge.
   *
   * @param {Array<LevelInfo>} levels - The list of available levels.
   * @param {RewardInfo} selectedBadge - The selected badge.
   * @returns {string} The name of the level for the badge, or 'Unbekannt' if not found.
   */
  findLevelForSelectedBadge(levels: Array<LevelInfo>, selectedBadge: RewardInfo): string {
    return levels.find((l) => l.id === selectedBadge?.levelId)?.name ?? 'Unbekannt';
  }

  /**
   * Retrieves the claim object for a given badge and user.
   *
   * @param {UserRepresentation} user - The current user.
   * @param {string | undefined} badgeId - The ID of the badge.
   * @returns {RewardClaimInfo | null} The claim object for the badge, or null if not found.
   */
  getClaimForBadge(user: UserRepresentation, badgeId: string | undefined): RewardClaimInfo | null {
    if (!user?.rewardClaims?.length || !badgeId) return null;
    return user.rewardClaims.find((r: RewardClaimInfo) => r.rewardId === badgeId) ?? null;
  }

  /**
   * Returns the image URL for the given badge, depending on whether it is earned.
   *
   * @param {RewardInfo} selectedBadge - The badge for which to get the image URL.
   * @param {boolean} isEarned - Indicates if the badge is already earned.
   * @returns {string} The URL of the badge image.
   */
  getBadgeImageUrl(selectedBadge: RewardInfo, isEarned: boolean): string {
    let imgUrl = selectedBadge.imageUrl;

    if (selectedBadge.imageUrl === '') {
      if (isEarned) {
        imgUrl = 'assets/badges/badge.png';
      } else {
        imgUrl = 'assets/badges/badge_locked.png';
      }
    }

    return imgUrl;
  }
}
