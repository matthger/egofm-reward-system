import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ConfirmationService } from 'primeng/api';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Password } from 'primeng/password';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserRepresentation } from '@egofm-reward/shared';

import { changePassword, deleteUser, updateUser } from '../../state/user/user.actions';
import {
  selectChangePasswordError,
  selectChangePasswordSuccess,
  selectCurrentUser,
  selectUpdateUserError,
  selectUpdateUserSuccess,
} from '../../state/user/user.selector';

/**
 * Component for managing the user account, including profile updates, password changes, and account deletion.
 */
@Component({
  selector: 'app-account',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Card,
    InputText,
    Password,
    Button,
    ConfirmDialogModule,
    Message,
  ],
  providers: [ConfirmationService],
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent {
  currentUser$: Observable<UserRepresentation | null>;
  userError$: Observable<unknown>;
  userSuccess$: Observable<unknown>;
  passwordError$: Observable<unknown>;
  passwordSuccess$: Observable<boolean>;
  userForm: FormGroup;
  passwordForm: FormGroup;
  userId = '';

  /**
   * AccountComponent constructor
   *
   * @param {ConfirmationService} confirmationService - Service for confirmation dialogs.
   * @param {Store} store - NgRx store for state management.
   * @param {FormBuilder} fb - FormBuilder for creating forms.
   */
  constructor(
    private readonly confirmationService: ConfirmationService,
    private readonly store: Store,
    private readonly fb: FormBuilder,
  ) {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.userError$ = this.store.select(selectUpdateUserError);
    this.userSuccess$ = this.store.select(selectUpdateUserSuccess);
    this.passwordError$ = this.store.select(selectChangePasswordError);
    this.passwordSuccess$ = this.store.select(selectChangePasswordSuccess);

    this.userForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group(
      {
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPasswordRepeat: ['', [Validators.required]],
      },
      { validators: this.passwordsMatchValidator },
    );

    this.currentUser$
      .pipe(
        map((user) => {
          if (user) {
            this.userId = user.id;

            this.userForm.patchValue({
              username: user.username,
              email: user.email,
            });
          }
        }),
        takeUntilDestroyed(),
      )
      .subscribe();
  }

  /**
   * Saves the profile data if the form is valid and dispatches the updateUser action.
   */
  onSaveProfile(): void {
    if (this.userForm.valid) {
      const { username, email } = this.userForm.value;
      this.store.dispatch(updateUser({ id: this.userId, user: { username, email } }));
      this.userForm.markAsPristine();
    }
  }

  /**
   * Changes the password if the form is valid and dispatches the changePassword action.
   */
  onChangePassword(): void {
    if (this.passwordForm.valid) {
      const { oldPassword, newPassword } = this.passwordForm.value;
      this.store.dispatch(changePassword({ id: this.userId, oldPassword, password: newPassword }));
      this.passwordForm.reset();
    }
  }

  /**
   * Opens a confirmation dialog for account deletion and dispatches the deleteUser action if confirmed.
   */
  onDeleteAccount(): void {
    this.confirmationService.confirm({
      message: 'Möchtest du deinen Account wirklich unwiderruflich löschen?',
      header: 'Account löschen',
      acceptIcon: 'pi pi-trash',
      acceptLabel: 'Ja, löschen',
      rejectVisible: false,
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.store.dispatch(deleteUser({ id: this.userId })),
    });
  }

  /**
   * Validator that checks if the new password and its repetition match.
   *
   * @param {FormGroup} form - The form group containing the password fields.
   * @returns {null | object} - Returns null if passwords match, otherwise an error object.
   */
  passwordsMatchValidator(form: FormGroup): null | object {
    const newPassword = form.get('newPassword')?.value;
    const newPasswordRepeat = form.get('newPasswordRepeat')?.value;

    return newPassword === newPasswordRepeat ? null : { passwordMismatch: true };
  }
}
