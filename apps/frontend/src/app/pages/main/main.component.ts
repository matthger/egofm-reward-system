import { AsyncPipe, DatePipe, DecimalPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Button, ButtonSeverity } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import { Divider } from 'primeng/divider';
import { GalleriaModule } from 'primeng/galleria';
import { ProgressBar } from 'primeng/progressbar';
import { combineLatest, Observable, map } from 'rxjs';

import {
  LeaderboardEntry,
  UserRepresentation,
  RewardClaimStatus,
  NewsItem,
  ActionInfo,
  ActionEnum,
} from '@egofm-reward/shared';

import { LevelProgressComponent } from '../../components/level-progress/level-progress.component';
import { StreakComponent } from '../../components/streak/streak.component';
import { selectAllActions } from '../../state/action/action.selector';
import { createActionLog } from '../../state/action-logs/action-log.actions';
import { selectLeaderboard } from '../../state/leaderboard/leaderboard.selectors';
import { selectCurrentUser } from '../../state/user/user.selector';

/**
 * Main dashboard component displaying user information, leaderboard, news, and streams.
 */
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    CardModule,
    Avatar,
    ProgressBar,
    NgForOf,
    CarouselModule,
    Button,
    NgClass,
    NgIf,
    Divider,
    DecimalPipe,
    AsyncPipe,
    LevelProgressComponent,
    DatePipe,
    GalleriaModule,
    StreakComponent,
    RouterLink,
  ],
  providers: [MessageService],
  templateUrl: './main.component.html',
})
export class MainComponent {
  currentUser$: Observable<UserRepresentation | null>;
  actions$: Observable<Array<ActionInfo>>;
  currentUserRank$: Observable<number>;
  fullLeaderboard$: Observable<Array<LeaderboardEntry>>;
  personalLeaderboard$: Observable<Array<LeaderboardEntry>>;
  collectedBadgesCount$: Observable<number>;
  actions: Array<ActionInfo> = [];

  images = [
    { image: '/assets/images/banner_themenwoche.png' },
    { image: '/assets/images/banner_app.png' },
    { image: '/assets/images/banner_egofm_nimmt_dich_mit.png' },
    { image: '/assets/images/banner_egofm_plus.png' },
    { image: '/assets/images/banner_merch.png' },
    { image: '/assets/images/banner_surfin.png' },
  ];

  newsList: Array<NewsItem> = [
    {
      image: 'assets/images/egofm-fest.jpg',
      title: 'Das egoFM fest in 2025 in Regensburg',
      date: '05/06/2025',
      description:
        'Wir bringen wieder feinsten Sound nach Regensburg! Hol dir jetzt dein Ticket fürs egoF...',
      likes: 210,
      liked: true,
      saved: false,
    },
    {
      image: 'assets/images/egofm-42.png',
      title: 'egoFM 42',
      date: '06/21/2025',
      description:
        'Die Antwort auf alle Fragen? Deine 42 Lieblingslieder! Jeden Samstag zwischen 18 und 2...',
      likes: 254,
      liked: false,
      saved: false,
    },
    {
      image: 'assets/images/egofm_sonnemondsterne.jpg',
      title: 'SonneMondSterne 2025',
      date: '06/16/2025',
      description:
        'Wenn du Lust auf eines der größten Elektro-Festivals in Europa hast, dann musst du die...',
      likes: 37,
      liked: false,
      saved: false,
    },
    {
      image: 'assets/images/gta-vi.jpg',
      title: 'Alles, was wir über GTA VI wissen',
      date: '06/05/2025',
      description:
        'Das Internet brennt mal wieder. Der Grund: Es gibt endlich neue, konkretere Infos zum ...',
      likes: 5346,
      liked: false,
      saved: false,
    },
  ];

  streams = [
    {
      name: 'egoFM Live Stream',
      icon: '/assets/images/streams/live.png',
      status: '80k Zuhörer',
      statusColor: 'text-primary',
    },
    {
      name: 'egoRAP',
      icon: '/assets/icons/rap-icon.png',
      status: '15k Zuhörer',
      statusColor: 'text-primary',
    },
    {
      name: 'egoSOUL',
      icon: '/assets/images/streams/soul.png',
      status: 'Trending🔥',
      statusColor: 'text-yellow-400',
    },
    {
      name: 'egoSUN',
      icon: '/assets/images/streams/sun.png',
      status: null,
      statusColor: '',
    },
    {
      name: 'egoCHILLOUT',
      icon: '/assets/images/streams/chillout.png',
      status: null,
      statusColor: '',
    },
    {
      name: 'egoFM Hall of Fame',
      icon: '/assets/images/streams/fame.png',
      status: null,
      statusColor: '',
    },
    {
      name: 'egoFLASH',
      icon: '/assets/images/streams/flash.png',
      status: null,
      statusColor: '',
    },
    {
      name: 'egoFM H&K',
      icon: '/assets/images/streams/h&k.png',
      status: null,
      statusColor: '',
    },
    {
      name: 'egoJAZZ',
      icon: '/assets/images/streams/jazz.png',
      status: null,
      statusColor: '',
    },
    {
      name: 'egoFM Kavka',
      icon: '/assets/images/streams/kavka.png',
      status: null,
      statusColor: '',
    },
    {
      name: 'egoPURE',
      icon: '/assets/images/streams/pure.png',
      status: null,
      statusColor: '',
    },
    {
      name: 'egoRNB',
      icon: '/assets/images/streams/r&b.png',
      status: null,
      statusColor: '',
    },
    {
      name: 'egoRIFF',
      icon: '/assets/images/streams/riff.png',
      status: null,
      statusColor: '',
    },
    {
      name: 'egoFM SEEWALD',
      icon: '/assets/images/streams/seewald.png',
      status: null,
      statusColor: '',
    },
    {
      name: 'egoSNOW',
      icon: '/assets/images/streams/snow.png',
      status: null,
      statusColor: '',
    },
  ];

  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: '1024px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  isPlaying = false;

  /**
   * MainComponent constructor
   *
   * @param {Store} store - Store for state management
   */
  constructor(private readonly store: Store) {
    this.currentUser$ = this.store.select(selectCurrentUser);
    this.fullLeaderboard$ = this.store.select(selectLeaderboard);
    this.actions$ = this.store.select(selectAllActions);

    this.actions$
      .pipe(
        map((actions) => (this.actions = actions)),
        takeUntilDestroyed(),
      )
      .subscribe();

    this.collectedBadgesCount$ = this.currentUser$.pipe(
      map(
        (user) =>
          user?.rewardClaims?.filter((rc) => rc.status === RewardClaimStatus.SENT).length ?? 0,
      ),
    );

    this.currentUserRank$ = combineLatest([this.fullLeaderboard$, this.currentUser$]).pipe(
      map(
        ([leaderboard, currentUser]) =>
          leaderboard.find((entry) => entry.username === currentUser?.username)?.rank ?? -1,
      ),
    );

    this.personalLeaderboard$ = combineLatest([this.fullLeaderboard$, this.currentUser$]).pipe(
      map(([leaderboard, currentUser]): Array<LeaderboardEntry> => {
        if (!leaderboard?.length || !currentUser) {
          return [];
        }

        const index = leaderboard.findIndex((entry) => entry.username === currentUser.username);

        if (index === -1) {
          return [];
        }

        const personalLeaderboard: Array<LeaderboardEntry> = [];

        personalLeaderboard.push(leaderboard[index]);

        if (index === 0) {
          if (leaderboard[1]) personalLeaderboard.push(leaderboard[1]);
          if (leaderboard[2]) personalLeaderboard.push(leaderboard[2]);
        } else if (index === leaderboard.length - 1) {
          if (leaderboard[index - 2]) personalLeaderboard.push(leaderboard[index - 2]);
          if (leaderboard[index - 1]) personalLeaderboard.push(leaderboard[index - 1]);
        } else {
          if (leaderboard[index - 1]) personalLeaderboard.push(leaderboard[index - 1]);
          if (leaderboard[index + 1]) personalLeaderboard.push(leaderboard[index + 1]);
        }

        return personalLeaderboard.sort((a, b) => a.rank - b.rank);
      }),
    );
  }

  /**
   * Toggles the playback state between playing and paused.
   */
  togglePlay(): void {
    this.isPlaying = !this.isPlaying;
  }

  /**
   * Toggles the like status of a news item and updates the like count.
   * Dispatches an action log if the post is liked.
   *
   * @param {NewsItem} newsItem - The news item to like or unlike
   * @param {UserRepresentation} currentUser - The current user performing the action
   */
  toggleLike(newsItem: NewsItem, currentUser: UserRepresentation): void {
    newsItem.liked = !newsItem.liked;
    newsItem.likes += newsItem.liked ? 1 : -1;

    if (newsItem.liked) {
      this.store.dispatch(
        createActionLog({
          payload: {
            userId: currentUser.id,
            actionId: this.getActionIdByName(ActionEnum.LIKE_POST) ?? '',
          },
        }),
      );
    }
  }

  /**
   * Returns the button severity style based on whether the item is liked.
   *
   * @param {boolean} liked - Whether the item is liked
   * @returns {ButtonSeverity} - The corresponding button severity
   */
  getButtonSeverity(liked: boolean): ButtonSeverity {
    return liked ? 'danger' : 'secondary';
  }

  /**
   * Retrieves the action ID for a given action name.
   *
   * @param {ActionEnum} name - The name of the action
   * @returns {string | undefined} - The corresponding action ID
   */
  getActionIdByName(name: ActionEnum): string | undefined {
    return this.actions.find((a) => a.name === name)?.id;
  }
}
