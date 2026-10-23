import { Routes } from '@angular/router';

import { AccountComponent } from './pages/account/account.component';
import { LoginComponent } from './pages/login/login.component';
import { MainComponent } from './pages/main/main.component';
import { RegisterComponent } from './pages/register/register.component';
import { RewardsComponent } from './pages/rewards/rewards.component';
import { AuthGuard } from './utils/guards/auth.guard';
import { LoginGuard } from './utils/guards/login.guard';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'rewards', canActivate: [AuthGuard], component: RewardsComponent },
  { path: 'login', canActivate: [LoginGuard], component: LoginComponent },
  { path: 'account', canActivate: [AuthGuard], component: AccountComponent },
  { path: 'register', canActivate: [LoginGuard], component: RegisterComponent },
  { path: '**', redirectTo: '' },
];
