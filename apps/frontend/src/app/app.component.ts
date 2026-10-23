import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { Toast } from 'primeng/toast';

import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AuthService } from './state/auth/auth.service';
import { loadLeaderboard } from './state/leaderboard/leaderboard.actions';
import { loadCurrentUser } from './state/user/user.actions';

/**
 * Main application component that serves as the root of the Angular application.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, LoadingSpinnerComponent, Toast],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  /**
   * App constructor
   *
   * @param {AuthService} authService - The authentication service
   * @param {Store} store - Store for state management
   */
  constructor(private readonly authService: AuthService, private readonly store: Store) {}

  /**
   * OnInit lifecycle method
   */
  public ngOnInit(): void {
    this.store.dispatch(loadLeaderboard());

    if (this.authService.isAuthenticated()) {
      this.store.dispatch(loadCurrentUser());
    }
  }
}
