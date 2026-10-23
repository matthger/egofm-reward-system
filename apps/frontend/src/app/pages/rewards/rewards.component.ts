import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Divider } from 'primeng/divider';
import { DialogService } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { Tooltip } from 'primeng/tooltip';
import { combineLatest, map, Observable } from 'rxjs';

import {
  ActionInfo,
  ActionLogDetails,
  ActionLogStatus,
  LevelInfo,
  UserRepresentation,
} from '@egofm-reward/shared';

import { ActionDialogComponent } from '../../components/action-dialog/action-dialog.component';
import { BadgeCollectionComponent } from '../../components/badge-collection/badge-collection.component';
import { LevelProgressComponent } from '../../components/level-progress/level-progress.component';
import { LevelUpDialogComponent } from '../../components/level-up-dialog/level-up-dialog.component';
import { selectAllActions } from '../../state/action/action.selector';
import { updateActionLog } from '../../state/action-logs/action-log.actions';
import { selectAllLevels } from '../../state/level/level.selector';
import { selectCurrentUser } from '../../state/user/user.selector';

/**
 * Component for displaying and managing user rewards and badges.
 */
@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [
    LevelProgressComponent,
    CardModule,
    ProgressBarModule,
    Button,
    CommonModule,
    BadgeCollectionComponent,
    Divider,
    Tooltip,
    Message,
  ],
  templateUrl: './rewards.component.html',
  styleUrls: ['./rewards.component.scss'],
})
export class RewardsComponent {
  currentUser$: Observable<UserRepresentation | null>;
  actions$: Observable<Array<ActionInfo>>;
  personalActions$: Observable<
    Array<ActionInfo & { status: string; claimable: boolean; actionLog?: ActionLogDetails }>
  >;
  missingRewardClaims$: Observable<Array<LevelInfo>>;

  /**
   * RewardsComponent constructor
   *
   * @param {DialogService} dialogService - PrimeNG dialog service
   * @param {Store} store - Store for state management
   */
  constructor(private readonly dialogService: DialogService, private readonly store: Store) {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.actions$ = this.store.select(selectAllActions);

    this.personalActions$ = combineLatest([this.actions$, this.currentUser$]).pipe(
      map(([actions, currentUser]) => {
        if (!actions?.length || !currentUser) {
          return [];
        }

        const actionLogsByActionId = new Map<string, Array<ActionLogDetails>>();
        for (const log of currentUser.actionLogs) {
          if (!actionLogsByActionId.has(log.actionId)) {
            actionLogsByActionId.set(log.actionId, []);
          }
          actionLogsByActionId.get(log.actionId)?.push(log);
        }

        return actions
          .map((action) => {
            const logs = actionLogsByActionId.get(action.id) ?? [];

            const claimableLog = logs.find((log) => log.status === ActionLogStatus.CLAIMABLE);
            const claimed = logs.some((log) => log.status === ActionLogStatus.CLAIMED);

            const status = claimed && !claimableLog ? 'done' : 'open';

            return {
              ...action,
              status,
              claimable: !!claimableLog,
              actionLog: claimableLog,
            };
          })
          .sort((a, b) => {
            if (a.status === b.status) {
              return 0;
            }
            return a.status === 'open' ? -1 : 1;
          });
      }),
    );

    this.missingRewardClaims$ = combineLatest([
      this.store.select(selectCurrentUser),
      this.store.select(selectAllLevels),
    ]).pipe(
      map(([user, levels]) => {
        if (!user || !levels?.length) return [];

        const claimedLevels = new Set(user.rewardClaims.map((rc) => rc.levelId));

        return levels.filter(
          (level) => level.id <= user.levelId && level.id > 1 && !claimedLevels.has(level.id),
        );
      }),
    );
  }

  /**
   * Claims a task for the current user by dispatching an action log creation.
   *
   * @param {string} actionLogId - The ID of the action log.
   * @param {string} actionId - The ID of the action to claim.
   * @param {string} userId - The ID of the user claiming the action.
   */
  claimTask(actionLogId: string | undefined, actionId: string, userId: string): void {
    if (!actionLogId) {
      return;
    }

    this.store.dispatch(
      updateActionLog({
        id: actionLogId,
        payload: { actionId, userId, status: ActionLogStatus.CLAIMED },
      }),
    );
  }

  /**
   * Opens the dialog to claim a missing reward for a level.
   *
   * @param {LevelInfo} level - The level for which the reward should be claimed.
   */
  openMissingRewardDialog(level: LevelInfo): void {
    this.dialogService.open(LevelUpDialogComponent, {
      header: 'Belohnung nachholen',
      width: '40rem',
      modal: true,
      closeOnEscape: false,
      styleClass: 'mx-3',
      data: {
        showAnimation: false,
        level,
      },
    });
  }

  /**
   * Opens the dialog to display details and logs for a specific action.
   *
   * @param {ActionInfo & { status: string }} action - The action with status to display in the dialog.
   */
  openActionDialog(action: ActionInfo & { status: string }): void {
    this.dialogService.open(ActionDialogComponent, {
      showHeader: false,
      width: '40rem',
      modal: true,
      closable: false,
      styleClass: 'mx-3',
      data: action,
    });
  }
}
