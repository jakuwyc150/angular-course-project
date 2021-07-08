import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Config } from '../../../../src/config';
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
  userSubject = new BehaviorSubject<UserModel>(null);

  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + Config.FIREBASE_API_KEY, {
      email, password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(responseData => this.handleAuthentication(responseData.email, responseData.idToken, Number(responseData.expiresIn), responseData.localId))
    );
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + Config.FIREBASE_API_KEY, {
      email, password,
      returnSecureToken: true
    }).pipe(
      catchError(this.handleError),
      tap(responseData => this.handleAuthentication(responseData.email, responseData.idToken, Number(responseData.expiresIn), responseData.localId))
    );
  }

  private handleAuthentication(email: string, token: string, expiresIn: number, userID: string) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new UserModel(token, expirationDate, email, userID);

    this.userSubject.next(user);
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