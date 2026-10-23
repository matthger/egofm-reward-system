import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ActionInfo, ActionDetails } from '@egofm-reward/shared';

/**
 * Service to handle actions related to rewards.
 */
@Injectable({ providedIn: 'root' })
export class ActionService {
  /**
   * Constructor for ActionService.
   *
   * @param {HttpClient} http - The HttpClient instance to make HTTP requests.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches all available actions.
   *
   * @returns {Observable<Array<ActionInfo>>} An observable containing an array of ActionInfo objects.
   */
  getAllActions(): Observable<Array<ActionInfo>> {
    return this.http.get<Array<ActionInfo>>('/api/actions?activeOnly=true');
  }

  /**
   * Fetches details of a specific action by its ID.
   *
   * @param {string} id - The ID of the action to retrieve.
   * @returns {Observable<ActionDetails>} An observable containing the details of the action.
   */
  getActionById(id: string): Observable<ActionDetails> {
    return this.http.get<ActionDetails>(`/api/actions/${id}`);
  }
}
