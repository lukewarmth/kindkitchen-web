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

  /**
   * Submit an order
   * @param orderData The order data to submit
   */
  placeOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/orders`, orderData);
  }

  /**
   * Get user's order history
   */
  getUserOrders(): Observable<any> {
    return this.http.get(`${this.baseUrl}/orders`);
  }

  // Add '/admin' to the path for these administrative routes
  getMenuItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/admin/menu-items`);
  }

  createMenuItem(itemData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/menu-items`, itemData);
  }

  // Optional: Delete a food item (you'll need to add the destroy method in Laravel later)
  deleteMenuItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/admin/menu-items/${id}`);
  }

  // Create weekly menu
  createWeeklyMenu(menuData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin/weekly-menus`, menuData);
  }

  // Get weekly menu by date (for admin view)
  getWeeklyMenu(date?: string): Observable<any> {
    let url = `${this.baseUrl}/current-menu`;
    if (date) url += `?date=${date}`;
    return this.http.get(url);
  }
}
