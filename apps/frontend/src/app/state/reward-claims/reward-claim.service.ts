import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateRewardClaim, RewardClaimInfo } from '@egofm-reward/shared';

/**
 * Service for handling reward claim operations.
 */
@Injectable({ providedIn: 'root' })
export class RewardClaimService {
  /**
   * Creates a new RewardClaimService.
   *
   * @param {HttpClient} http - The Angular HTTP client for API requests.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Sends a request to create a new reward claim.
   *
   * @param {CreateRewardClaim} payload - The data for the reward claim to create.
   * @returns {Observable<RewardClaimInfo>} An observable with the created reward claim info.
   */
  createRewardClaim(payload: CreateRewardClaim): Observable<RewardClaimInfo> {
    return this.http.post<RewardClaimInfo>('/api/reward-claims', payload);
  }
}
