import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from '../models/trip';
import { User } from '../models/user';
import { AuthResponse } from '../models/authresponse';
import { BROWSER_STORAGE } from '../storage';

@Injectable({
  providedIn: 'root'
})

export class TripDataService {

  constructor(private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage) {}

  tripUrl = 'http://localhost:3000/api/trips';
  apiBaseUrl = 'http://localhost:3000/api/';

  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripUrl);
  }

  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.tripUrl, formData);
  }

  getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.tripUrl}/${tripCode}`);
  }

  updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.tripUrl}/${formData.code}`, formData);
  }

  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }

  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }

  public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user);
  }

  private makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return this.http
      .post(url, user)
      .toPromise()
      .then(response => response as AuthResponse)
      .catch(this.handleError);
  }

  // Updated getToken method to handle null
  public getToken(): string | null {
    return this.storage.getItem('travlr-token');
  }

  // Updated getCurrentUser method with null check
  public getCurrentUser(): User | null {
    if (this.isLoggedIn()) {
      const token = this.getToken();
      if (token) {  // Ensure token is not null
        const { email, name } = JSON.parse(atob(token.split('.')[1]));
        return { email, name } as User;
      }
      return null;  // Token is null, handle gracefully
    }
    return null;  // Return null if not logged in
  }

  // Updated isLoggedIn method with null check
  public isLoggedIn(): boolean {
    return !!this.getToken(); // Checks if token exists
  }
}
