import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, take } from 'rxjs/operators';

import { AuthService } from '../../state/auth/auth.service';
import { selectUsersState } from '../../state/user/user.selector';

/**
 * LoginGuard is an Angular route guard that checks if the user is authenticated.
 */
@Injectable({ providedIn: 'root' })
export class LoginGuard implements CanActivate {
  /**
   * LoginGuard constructor
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
   * @returns {Observable<boolean>} - An observable that emits true if the user is not authenticated, false otherwise.
   */
  canActivate(): Observable<boolean> {
    const token = this.auth.getToken();

    if (!token) {
      return of(true);
    }

    return this.store.select(selectUsersState).pipe(
      filter((state) => state.loaded || !!state.error),
      take(1),
      map((state) => {
        if (state.currentUser) {
          this.redirectToRewards();
        }
        return true;
      }),
      catchError(() => of(true)),
    );
  }

  /**
   * Redirect to rewards page if user is already authenticated.
   *
   * @returns {false} - User cannot access this page
   * @private
   */
  private redirectToRewards(): false {
    void this.router.navigate(['/rewards']);
    return false;
  }
}
