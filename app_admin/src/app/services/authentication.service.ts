import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/authresponse';
import { TripDataService } from '../services/trip-data.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  
  // Setup our storage and service access
  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}

  // Variable to handle Authentication Responses
  authResp: AuthResponse = new AuthResponse();

  // Get our token from our Storage provider.
  public getToken(): string | null {
    return this.storage.getItem('travlr-token');
  }

  // Save our token to our Storage provider.
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  // Logout of our application and remove the JWT from Storage
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  // Boolean to determine if we are logged in and the token is still valid.
  public isLoggedIn(): boolean {
    const token: string | null = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp > Date.now() / 1000;
      } catch (error) {
        console.error('Invalid token format', error);
        return false;
      }
    } else {
      return false;
    }
  }

  // Retrieve the current user. This function should only be called after checking isLoggedIn.
  public getCurrentUser(): User | null {
    if (this.isLoggedIn()) {
      const token: string | null = this.getToken();
      if (token) { 
        try {
          const { email, name } = JSON.parse(atob(token.split('.')[1]));
          return { email, name } as User;
        } catch (error) {
          console.error('Invalid token or missing user data', error);
          return null;
        }
      }
    }
    return null;
  }

  // Login method that uses the login method in tripDataService.
  public login(user: User): Promise<any> {
    return this.tripDataService
      .login(user)
      .then((authResp: AuthResponse) => this.saveToken(authResp.token))
      .catch((error) => {
        console.error('Login failed', error);
        throw new Error('Login failed');
      });
  }

  // Register method that uses the register method in tripDataService.
  public register(user: User): Promise<any> {
    return this.tripDataService
      .register(user)
      .then((authResp: AuthResponse) => this.saveToken(authResp.token))
      .catch((error) => {
        console.error('Registration failed', error);
        throw new Error('Registration failed');
      });
  }
}
