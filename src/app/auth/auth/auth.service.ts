import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Config } from '../../../../src/config';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + Config.FIREBASE_API_KEY, {
      email, password,
      returnSecureToken: true
    });
  }
}