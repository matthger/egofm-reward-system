import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { LevelInfo, LevelDetails } from '@egofm-reward/shared';

/**
 * LevelService provides methods to interact with the level API.
 */
@Injectable({ providedIn: 'root' })
export class LevelService {
  /**
   * Creates an instance of LevelService.
   *
   * @param {HttpClient} http - The HttpClient instance for making HTTP requests.
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches all levels from the API.
   *
   * @returns {Observable<Array<LevelInfo>>} An observable containing an array of LevelInfo objects.
   */
  getAllLevels(): Observable<Array<LevelInfo>> {
    return this.http.get<Array<LevelInfo>>('/api/level');
  }

  /**
   * Fetches a specific level by its ID.
   *
   * @param {number} id - The ID of the level to fetch.
   * @returns {Observable<LevelDetails>} An observable containing the details of the level.
   */
  getLevelById(id: number): Observable<LevelDetails> {
    return this.http.get<LevelDetails>(`/api/level/${id}`);
  }
}
