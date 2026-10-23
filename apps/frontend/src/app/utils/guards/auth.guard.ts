import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, take } from 'rxjs/operators';

import { AuthService } from '../../state/auth/auth.service';
import { selectUsersState } from '../../state/user/user.selector';

/**
 * AuthGuard is an Angular route guard that checks if the user is authenticated before allowing access to certain routes.
 */
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  /**
   * AuthGuard constructor
   *
   * @param {AuthService} auth - AuthService for authentication operations
   * @param {Router} router - Router for navigation
   * @param {Store} store - Store for state management
   */
  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  /**
   * Checks if the user is authenticated by verifying the presence of a token and loading the current user.
   *
   * @returns {Observable<boolean>} - An observable that emits true if the user is authenticated, false otherwise.
   */
  canActivate(): Observable<boolean> {
    const token = this.auth.getToken();

    if (!token) {
      return of(this.redirectToLogin());
    }

    return this.store.select(selectUsersState).pipe(
      filter((state) => state.loaded || !!state.error),
      take(1),
      map((state) => {
        const isValid = !!state.currentUser;
        return isValid ? true : this.redirectToLogin();
      }),
      catchError(() => of(this.redirectToLogin())),
    );
  }

  /**
   * Redirect to login page if user cannot be loaded.
   *
   * @returns {false} - User cannot access this page
   * @private
   */
  private redirectToLogin(): false {
    void this.router.navigate(['/login']);
    return false;
  }
}
