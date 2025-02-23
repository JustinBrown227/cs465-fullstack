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

  // Fetch all trips
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(this.tripUrl);
  }

  // Add a new trip
  addTrip(formData: Trip): Observable<Trip> {
    return this.http.post<Trip>(this.tripUrl, formData);
  }

  // Get a specific trip by trip code
  getTrip(tripCode: string): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.tripUrl}/${tripCode}`);
  }

  // Update an existing trip
  updateTrip(formData: Trip): Observable<Trip> {
    return this.http.put<Trip>(`${this.tripUrl}/${formData.code}`, formData);
  }

  // Handle HTTP errors
  private handleError(error: any): Promise<any> {
    console.error('Something has gone wrong', error);
    return Promise.reject(error.message || error);
  }

  // Login method that calls the API's login endpoint
  public login(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('login', user);
  }

  // Register method that calls the API's register endpoint
  public register(user: User): Promise<AuthResponse> {
    return this.makeAuthApiCall('register', user);
  }

  // Helper method to make the login and register API calls
  private makeAuthApiCall(urlPath: string, user: User): Promise<AuthResponse> {
    const url: string = `${this.apiBaseUrl}/${urlPath}`;
    return this.http
      .post(url, user)
      .toPromise()
      .then(response => response as AuthResponse)
      .catch(this.handleError);
  }

  // Get the stored JWT token
  public getToken(): string | null {
    return this.storage.getItem('travlr-token');
  }

  // Retrieve the current user based on the token
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

  // Check if the user is logged in based on the presence of a valid token
  public isLoggedIn(): boolean {
    return !!this.getToken(); // Checks if token exists
  }
}
