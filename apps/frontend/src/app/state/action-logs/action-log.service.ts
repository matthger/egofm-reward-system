import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  ActionLogDetails,
  CreateActionLog,
  LevelDetails,
  UpdateActionLog,
} from '@egofm-reward/shared';

/**
 * Service for creating and managing action logs.
 */
@Injectable({ providedIn: 'root' })
export class ActionLogService {
  /**
   * ActionLogsService constructor
   *
   * @param {HttpClient} http - Angular HTTP client for API requests.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Creates a new action log entry.
   *
   * @param {CreateActionLog} payload - The action log data to create.
   * @returns {Observable<ActionLogDetails>} - emitting the created action log details.
   */
  createActionLog(payload: CreateActionLog): Observable<ActionLogDetails> {
    return this.http.post<ActionLogDetails>('/api/action-logs', payload);
  }

  /**
   * Updates an existing action log entry.
   *
   * @param {string} id - The ID of the action log to update.
   * @param {UpdateActionLog} payload - The updated action log data.
   * @returns {Observable<ActionLogDetails & { leveledUp: boolean; newLevel?: LevelDetails }>} - emitting the updated action log and level-up info.
   */
  updateActionLog(
    id: string,
    payload: UpdateActionLog,
  ): Observable<ActionLogDetails & { leveledUp: boolean; newLevel?: LevelDetails }> {
    return this.http.put<ActionLogDetails & { leveledUp: boolean; newLevel?: LevelDetails }>(
      `/api/action-logs/${id}`,
      payload,
    );
  }
}
