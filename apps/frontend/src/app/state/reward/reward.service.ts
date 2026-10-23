import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RewardInfo, RewardDetails } from '@egofm-reward/shared';

/**
 * RewardService is an Angular service that provides methods to interact with the rewards API.
 */
@Injectable({ providedIn: 'root' })
export class RewardService {
  /**
   * RewardService constructor
   *
   * @param {HttpClient} http - HttpClient for making HTTP requests
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches all rewards from the API.
   *
   * @returns {Observable<Array<RewardInfo>>} - An observable that emits an array of RewardInfo objects.
   */
  getAllRewards(): Observable<Array<RewardInfo>> {
    return this.http.get<Array<RewardInfo>>('/api/rewards?activeOnly=true');
  }

  /**
   * Fetches a specific reward by its ID from the API.
   *
   * @param {string} id - The ID of the reward to fetch.
   * @returns {Observable<RewardDetails>} - An observable that emits the details of the requested reward.
   */
  getRewardById(id: string): Observable<RewardDetails> {
    return this.http.get<RewardDetails>(`/api/rewards/${id}`);
  }
}
