import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { catchError, concatMap, first, map, mergeMap, of } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

import {
  createActionLog,
  createActionLogFailure,
  createActionLogSuccess,
  updateActionLog,
  updateActionLogFailure,
  updateActionLogSuccess,
} from './action-log.actions';
import { ActionLogService } from './action-log.service';
import { LevelUpDialogComponent } from '../../components/level-up-dialog/level-up-dialog.component';
import { loadCurrentUser, loadCurrentUserSuccess } from '../user/user.actions';

/**
 * Handles effects for action log actions.
 */
@Injectable()
export class ActionLogEffects {
  private readonly actions$ = inject(Actions);
  private readonly actionLogService = inject(ActionLogService);
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);

  createActionLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createActionLog),
      mergeMap(({ payload }) =>
        this.actionLogService.createActionLog(payload).pipe(
          map(() => createActionLogSuccess()),
          catchError((error) => of(createActionLogFailure({ error }))),
        ),
      ),
    ),
  );

  updateActionLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateActionLog),
      mergeMap(({ id, payload }) =>
        this.actionLogService.updateActionLog(id, payload).pipe(
          map((res) =>
            updateActionLogSuccess({ leveledUp: res.leveledUp, newLevel: res.newLevel }),
          ),
          catchError((error) => of(updateActionLogFailure({ error }))),
        ),
      ),
    ),
  );

  showMessageOnCreateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createActionLogSuccess),
        tap(() =>
          this.messageService.add({
            severity: 'success',
            summary: 'Aufgabe abgeschlossen!',
            detail: 'Belohnung ist jetzt auf der Rewards-Seite verfügbar.',
            life: 5000,
          }),
        ),
      ),
    { dispatch: false },
  );

  showMessageOnCreateFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createActionLogFailure),
        tap(() =>
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler beim Abschließen der Aufgabe!',
            detail: 'Versuche es später erneut.',
            life: 5000,
          }),
        ),
      ),
    { dispatch: false },
  );

  showMessageOnUpdateSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateActionLogSuccess),
        tap(() =>
          this.messageService.add({
            severity: 'success',
            summary: 'Belohnung abgeholt!',
            detail: 'Deine Punkte wurden aktualisiert.',
            life: 5000,
          }),
        ),
      ),
    { dispatch: false },
  );

  showMessageOnUpdateFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateActionLogFailure),
        tap(() =>
          this.messageService.add({
            severity: 'error',
            summary: 'Fehler!',
            detail: 'Versuche es später erneut.',
            life: 5000,
          }),
        ),
      ),
    { dispatch: false },
  );

  reloadCurrentUserAfterActionLog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createActionLogSuccess, updateActionLogSuccess),
      map(() => loadCurrentUser()),
    ),
  );

  showLevelUpDialog$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateActionLogSuccess),
        filter(({ leveledUp }) => leveledUp),
        concatMap(({ newLevel }) =>
          this.actions$.pipe(
            ofType(loadCurrentUserSuccess),
            first(),
            tap(() => {
              this.dialogService.open(LevelUpDialogComponent, {
                header: 'Level Up! 🎉',
                data: {
                  showAnimation: true,
                  level: newLevel,
                },
                width: '40rem',
                modal: true,
                closeOnEscape: false,
                styleClass: 'mx-3',
              });
            }),
          ),
        ),
      ),
    { dispatch: false },
  );
}
