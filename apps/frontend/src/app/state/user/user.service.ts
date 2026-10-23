import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { UpdateUser, UserDetails, UserRepresentation } from '@egofm-reward/shared';

/**
 * Service to manage user-related operations such as fetching user details.
 */
@Injectable({ providedIn: 'root' })
export class UserService {
  /**
   * UserService is responsible for managing user-related operations.
   *
   * @param {HttpClient} http - HttpClient for making HTTP requests
   */
  constructor(private readonly http: HttpClient) {}

  /**
   * Fetches the current user's details.
   *
   * @returns {Observable<UserRepresentation>} - An observable containing the user representation.
   */
  getMe(): Observable<UserRepresentation> {
    return this.http.get<UserRepresentation>('/api/users/me');
  }

  /**
   * Updates the user with the given ID.
   *
   * @param {string} id - The ID of the user to update.
   * @param {UpdateUser} user - The user data to update.
   * @returns {Observable<UserDetails>} - An observable containing the updated user details.
   */
  updateUser(id: string, user: UpdateUser): Observable<UserDetails> {
    return this.http.put<UserDetails>(`/api/users/${id}`, { ...user });
  }

  /**
   * Deletes the user with the given ID.
   *
   * @param {string} id - The ID of the user to delete.
   * @returns {Observable<void>} - An observable that completes when the user is deleted.
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`/api/users/${id}`);
  }
}
