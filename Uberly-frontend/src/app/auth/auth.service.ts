import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { SignUp } from '../interfaces/sign-up';
import { AuthData } from '../interfaces/auth-data';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /*   apiURL = "https://outer-lane-kekice-635da50d.koyeb.app/auth/" */
  apiURL = 'http://localhost:8080/auth/';
  jwtHelper = new JwtHelperService();
  private authSub = new BehaviorSubject<AuthData | null>(null);
  user$ = this.authSub.asObservable();
  timeout: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(data: SignUp) {
    return this.http.post(`${this.apiURL}signup`, data, {
      responseType: 'text',
    });
  }

  login(data: { email: string; password: string }) {
    return this.http.post<AuthData>(`${this.apiURL}login`, data).pipe(
      tap((data) => {
        this.authSub.next(data);
        localStorage.setItem('user', JSON.stringify(data));
        this.autologout(data);
      })
    );
  }

  setUser(user: AuthData | null) {
    this.authSub.next(user);
  }

  clearUser() {
    this.authSub.next(null);
    localStorage.removeItem('user');
  }

  logout() {
    this.clearUser();
    this.router.navigate(['/']);
  }

  restore() {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      return;
    } else {
      const user: AuthData = JSON.parse(userJson);
      this.authSub.next(user);
      this.autologout(user);
    }
  }

  autologout(user: AuthData) {
    const dateExpiration = this.jwtHelper.getTokenExpirationDate(
      user.token
    ) as Date;
    const millisecondsExp = dateExpiration.getTime() - new Date().getTime();
    this.timeout = setTimeout(() => {
      this.logout();
    }, millisecondsExp);
  }
}
