import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Message } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { map, Observable } from 'rxjs';

import { ActionEnum, ActionInfo, ActionLogDetails, ActionLogStatus } from '@egofm-reward/shared';

import { selectCurrentUser } from '../../state/user/user.selector';
import { actionMetadataLabel } from '../../utils/labels/action-metadata-label.const';
import {
  compensateScrollbarShift,
  resetScrollbarCompensation,
} from '../../utils/scrollbar/scrollbar.utils';

/**
 * Dialog component to display details and logs for a specific action.
 */
@Component({
  selector: 'app-action-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DynamicDialogModule,
    ButtonModule,
    TableModule,
    NgOptimizedImage,
    Message,
  ],
  templateUrl: './action-dialog.component.html',
  styleUrls: ['./action-dialog.component.scss'],
})
export class ActionDialogComponent implements OnInit, OnDestroy {
  action: ActionInfo & { status: string };
  actionLogs$: Observable<Array<ActionLogDetails>>;

  protected readonly ActionEnum = ActionEnum;
  protected readonly actionMetadataLabel = actionMetadataLabel;

  /**
   * Creates an instance of ActionDialogComponent.
   *
   * @param {DynamicDialogConfig} dialogConfig The dialog configuration containing the action data.
   * @param {DynamicDialogRef} dialogRef Reference to the opened dialog.
   * @param {Store} store The NgRx store instance.
   */
  constructor(
    private readonly dialogConfig: DynamicDialogConfig,
    private readonly dialogRef: DynamicDialogRef,
    private readonly store: Store,
  ) {
    this.action = this.dialogConfig.data;

    this.actionLogs$ = this.store.select(selectCurrentUser).pipe(
      map((currentUser) => {
        if (!currentUser) {
          return [];
        }

        return currentUser.actionLogs.filter(
          (log) => log.actionId === this.action.id && log.status === ActionLogStatus.CLAIMED,
        );
      }),
    );
  }

  /**
   * Compensates the scrollbar shift when the dialog is opened.
   */
  ngOnInit(): void {
    compensateScrollbarShift();
  }

  /**
   * Resets scrollbar shift when the dialog is closed.
   */
  ngOnDestroy(): void {
    resetScrollbarCompensation();
  }

  /**
   * Converts the metadata object into an array of key-value pairs.
   *
   * @param {Record<string, unknown>} metadata The metadata object.
   * @returns {Array<{ key: string; value: unknown }>} Array of objects with key and value properties.
   */
  metadataEntries(metadata: Record<string, unknown>): Array<{ key: string; value: unknown }> {
    return Object.entries(metadata).map(([key, value]) => ({ key, value }));
  }

  /**
   * Closes the dialog and resets the scrollbar compensation.
   */
  close(): void {
    this.dialogRef.close();
  }
}
