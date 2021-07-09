import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { UserModel } from './user.model';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;

  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenExpirationTimer: any;
  userSubject = new BehaviorSubject<UserModel>(null);

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseKey, {
      email, password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(responseData => this.handleAuthentication(responseData.email, responseData.idToken, Number(responseData.expiresIn), responseData.localId))
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseKey, {
      email, password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(responseData => this.handleAuthentication(responseData.email, responseData.idToken, Number(responseData.expiresIn), responseData.localId))
    );
  }

  logout() {
    this.userSubject.next(null);
    this.router.navigate(['/auth']);

    localStorage.removeItem('userData');

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

  autoLogin() {
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }

    const loadedUser = new UserModel(
      userData.rawToken,
      new Date(userData.tokenExpirationDate),
      userData.email,
      userData.id
    );

    if (loadedUser.token) {
      const expirationDuration = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();

      this.userSubject.next(loadedUser);
      this.autoLogout(expirationDuration);
    }
  }

  autoLogout(millisecondsUntilInvalid: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, millisecondsUntilInvalid);
  }

  private handleAuthentication(email: string, token: string, expiresIn: number, userID: string) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new UserModel(token, expirationDate, email, userID);

    this.userSubject.next(user);
    localStorage.setItem('userData', JSON.stringify(user));

    this.autoLogout(expiresIn * 1000);
  }

  private handleError(errorResponse: HttpErrorResponse) {
    let errorMessage = "An unknown error occurred!";

    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMessage);
    }

    switch (errorResponse.error.error.message) {
      case "EMAIL_EXISTS": {
        errorMessage = "This email exists already";
        break;
      } case "EMAIL_NOT_FOUND": {
        errorMessage = "This email does not exist";
        break;
      } case "INVALID_PASSWORD": {
        errorMessage = "This password is not correct";
        break;
      }
    }

    return throwError(errorMessage);
  }
}