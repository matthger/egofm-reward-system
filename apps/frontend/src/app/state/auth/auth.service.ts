import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { CreateUser, LoginResponse, UserDetails } from '@egofm-reward/shared';

import { setAuthState } from './auth.actions';

/**
 * Service to handle authentication operations such as login, logout, and token management.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'accessToken';

  /**
   * AuthService constructor
   *
   * @param {HttpClient} http - HttpClient for making HTTP requests
   * @param {Router} router - Router for navigation
   * @param {Store} store - NgRx Store for state management
   */
  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
    private readonly store: Store,
  ) {}

  /**
   * Logs in the user with provided credentials.
   *
   * @param {string} username - Username for login
   * @param {string} password - Password for login
   * @returns {Observable<LoginResponse>} - Observable containing the login response
   */
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>('/api/auth/login', { username, password }).pipe(
      tap((res) => {
        localStorage.setItem(this.TOKEN_KEY, res.accessToken);
      }),
    );
  }

  /**
   * Sets the authentication state from user details and token.
   *
   * @param {Partial<UserDetails>} user - Partial user details containing id, username, and role
   * @param {string} token - Authentication token
   */
  setAuthFromUser(user: Partial<UserDetails>, token: string): void {
    this.store.dispatch(
      setAuthState({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
        },
        token,
      }),
    );
  }

  /**
   * Logs out the user by removing the token from local storage and navigating to the login page.
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    void this.router.navigate(['/login']);
  }

  /**
   * Registers a new user with the provided user data.
   *
   * @param {CreateUser} user - The user data for registration
   * @returns {Observable<UserDetails>} - Observable containing the details of the newly registered user
   */
  register(user: CreateUser): Observable<UserDetails> {
    return this.http.post<UserDetails>('/api/users', user);
  }

  /**
   * Retrieves the authentication token from local storage.
   *
   * @returns {string | null} - The authentication token or null if not found
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Checks if the user is authenticated by verifying the presence of a token.
   *
   * @returns {boolean} - True if the user is authenticated, false otherwise
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
