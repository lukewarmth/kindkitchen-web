import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Because of our proxy, we just use /api
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Get the CSRF cookie from Laravel (Required before logging in)
   */
  getCsrfToken(): Observable<any> {
    return this.http.get('/sanctum/csrf-cookie');
  }

  /**
   * Register a new user
   */
  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, data);
  }

  /**
   * Login (Combined flow: Get Cookie -> Send Credentials)
   */
  login(credentials: any): Observable<any> {
    // We actually just return the POST request here.
    // The component will handle the subscription.
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  /**
   * Logout
   */
  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {});
  }

  /**
   * Get currently logged in user
   */
  getUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/user`);
  }
}
