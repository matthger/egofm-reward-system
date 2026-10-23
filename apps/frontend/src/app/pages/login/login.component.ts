import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputText } from 'primeng/inputtext';
import { Message } from 'primeng/message';
import { Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { Login } from '@egofm-reward/shared';

import { login } from '../../state/auth/auth.actions';
import { selectAuthError } from '../../state/auth/auth.selector';
import { loadCurrentUserSuccess } from '../../state/user/user.actions';

/**
 * Login component to authenticate users and redirect on success.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputText,
    Button,
    Card,
    InputGroup,
    InputGroupAddon,
    Message,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  submitted = false;

  error$: Observable<unknown>;

  /**
   * LoginComponent constructor
   *
   * @param {FormBuilder} fb - FormBuilder for creating reactive forms
   * @param {Actions} actions$ - NgRx actions
   * @param {Router} router - Router for navigation
   * @param {Store} store - NgRx store for state management
   */
  constructor(
    private readonly fb: FormBuilder,
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly store: Store,
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.error$ = this.store.select(selectAuthError);

    this.actions$
      .pipe(
        ofType(loadCurrentUserSuccess),
        take(1),
        tap(() => void this.router.navigate(['/rewards'])),
      )
      .subscribe();
  }

  /**
   * Attempts to log the user in using the form credentials.
   */
  login(): void {
    this.submitted = true;

    if (this.loginForm.invalid) return;

    this.store.dispatch(login({ credentials: this.loginForm.value as Login }));
  }

  /**
   * Resets the login form and clears submission state and errors.
   */
  reset(): void {
    this.loginForm.reset();
    this.submitted = false;
  }
}
