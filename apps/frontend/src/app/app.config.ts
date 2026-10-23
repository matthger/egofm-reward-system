import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, isDevMode, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { providePrimeNG } from 'primeng/config';
import { DialogService } from 'primeng/dynamicdialog';
import { MenubarModule } from 'primeng/menubar';

import { routes } from './app.routes';
import { ActionEffects } from './state/action/action.effects';
import { ActionLogEffects } from './state/action-logs/action-log.effects';
import { reducers } from './state/app.reducers';
import { AuthEffects } from './state/auth/auth.effects';
import { LeaderboardEffects } from './state/leaderboard/leaderboard.effects';
import { LevelEffects } from './state/level/level.effects';
import { metaReducers } from './state/meta-reducers';
import { RewardEffects } from './state/reward/reward.effects';
import { RewardClaimEffects } from './state/reward-claims/reward-claim.effects';
import { UserEffects } from './state/user/user.effects';
import { JwtInterceptor } from './utils/interceptor/jwt.interceptor';

const EgoFMPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#f4fbe6',
      100: '#e7f5c2',
      200: '#d5ec8a',
      300: '#c1e055',
      400: '#95c02b',
      500: '#7ea626',
      600: '#6a8f21',
      700: '#597a1c',
      800: '#476517',
      900: '#345011',
      950: '#283f0d',
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(BrowserModule, MenubarModule, CardModule),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    providePrimeNG({
      theme: {
        preset: EgoFMPreset,
      },
      translation: {
        passwordPrompt: 'Geben Sie ein Passwort ein',
        weak: 'Schwach',
        medium: 'Mittel',
        strong: 'Stark',
        dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        monthNames: [
          'Januar',
          'Februar',
          'März',
          'April',
          'Mai',
          'Juni',
          'Juli',
          'August',
          'September',
          'Oktober',
          'November',
          'Dezember',
        ],
        monthNamesShort: [
          'Jan',
          'Feb',
          'Mär',
          'Apr',
          'Mai',
          'Jun',
          'Jul',
          'Aug',
          'Sep',
          'Okt',
          'Nov',
          'Dez',
        ],
      },
    }),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    provideStore(reducers, { metaReducers }),
    provideEffects(
      AuthEffects,
      UserEffects,
      LevelEffects,
      ActionEffects,
      RewardEffects,
      LeaderboardEffects,
      ActionLogEffects,
      RewardClaimEffects,
    ),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      autoPause: true,
      trace: true,
      traceLimit: 75,
      connectInZone: true,
    }),
    { provide: LOCALE_ID, useValue: 'de' },
    DialogService,
    MessageService,
  ],
};
