import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { Button } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Menu } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { Skeleton } from 'primeng/skeleton';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserRepresentation } from '@egofm-reward/shared';

import { selectAppIsLoading } from '../../state/app.selectors';
import { logout } from '../../state/auth/auth.actions';
import { selectCurrentUser } from '../../state/user/user.selector';

/**
 * The navbar component
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MenubarModule,
    RouterModule,
    BadgeModule,
    AvatarModule,
    InputTextModule,
    CommonModule,
    NgOptimizedImage,
    Menu,
    Button,
    Skeleton,
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  currentUser$: Observable<UserRepresentation | null>;
  items$: Observable<Array<MenuItem>>;
  isLoading$: Observable<boolean>;
  userMenuItems: Array<MenuItem>;

  /**
   * NavbarComponent constructor
   *
   * @param {Router} router - Router for navigation
   * @param {Store} store - Store for state management
   */
  constructor(private readonly router: Router, private readonly store: Store) {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.isLoading$ = this.store.select(selectAppIsLoading);

    this.items$ = this.currentUser$.pipe(
      map((user): Array<MenuItem> => {
        const items: Array<MenuItem> = [{ icon: 'pi pi-home', label: 'Home', routerLink: '/' }];
        if (user) {
          items.push({ icon: 'pi pi-trophy', label: 'Rewards', routerLink: '/rewards' });
        }
        return items;
      }),
    );

    this.userMenuItems = [
      {
        label: 'Mein Account',
        icon: 'pi pi-user',
        command: (): void => void this.router.navigate(['/account']),
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: (): void => this.logout(),
      },
    ];
  }

  /**
   * Logs out the user by dispatching the logout action to the store.
   */
  logout(): void {
    this.store.dispatch(logout());
  }
}
