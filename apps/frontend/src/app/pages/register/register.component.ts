import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddon } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PasswordModule } from 'primeng/password';
import { Observable } from 'rxjs';

import { register } from '../../state/auth/auth.actions';
import { selectRegisterError, selectRegisterSuccess } from '../../state/auth/auth.selector';
import { pastDateValidator } from '../../utils/validators/past-date.validator';

/**
 * Component for user registration. Handles the registration form and dispatches the register action.
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    CalendarModule,
    MessageModule,
    InputGroup,
    InputGroupAddon,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  success$: Observable<boolean>;
  error$: Observable<unknown>;

  registerForm: FormGroup;

  /**
   * Initializes the registration form and subscribes to registration state.
   *
   * @param {FormBuilder} fb - Form builder for creating the form group
   * @param {Store} store - NgRx store for dispatching actions and selecting state
   */
  constructor(private readonly fb: FormBuilder, private readonly store: Store) {
    this.success$ = this.store.select(selectRegisterSuccess);
    this.error$ = this.store.select(selectRegisterError);

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      birthDate: ['', [Validators.required, pastDateValidator]],
    });
  }

  /**
   * Dispatches the register action with the form values and resets the form.
   */
  onRegister(): void {
    this.store.dispatch(register({ user: this.registerForm.value }));
    this.registerForm.reset();
  }
}
