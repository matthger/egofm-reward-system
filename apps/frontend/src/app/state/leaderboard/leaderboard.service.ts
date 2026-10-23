import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LeaderboardEntry } from '@egofm-reward/shared';

/**
 * Service for retrieving leaderboard data from the backend API.
 */
@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  /**
   * Creates an instance of LeaderboardService.
   *
   * @param {HttpClient} http - The HTTP client used to make API requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves the leaderboard entries from the backend.
   *
   * @returns {Observable<Array<LeaderboardEntry>>} - An observable containing the leaderboard entries.
   */
  getLeaderboard(): Observable<Array<LeaderboardEntry>> {
    return this.http.get<Array<LeaderboardEntry>>('/api/users/leaderboard');
  }
}
