import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../../state/auth/auth.service';

/**
 * Interceptor to add JWT token to outgoing HTTP requests.
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  /**
   * JwtInterceptor constructor
   *
   * @param {AuthService} auth - Service to handle authentication operations
   */
  constructor(private readonly auth: AuthService) {}

  /**
   * Intercepts HTTP requests to add the JWT token to the Authorization header.
   *
   * @param {HttpRequest<unknown>} req - The outgoing HTTP request
   * @param {HttpHandler} next - The next handler in the chain
   * @returns {Observable<HttpEvent<unknown>>} - An observable of the HTTP event
   */
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.auth.getToken();
    if (token) {
      req = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }
    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 401) {
          localStorage.removeItem('accessToken');
        }
        return throwError(() => err);
      }),
    );
  }
}
