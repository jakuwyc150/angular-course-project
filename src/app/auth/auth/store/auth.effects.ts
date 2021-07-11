import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap, map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthResponseData } from "../auth.service";
import * as AuthActions from './auth.actions';

const handleAuthentication = (expiresIn: number, email: string, userID: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

  return new AuthActions.AuthenticateSuccess({
    email, expirationDate, token, userID
  });
}

const handleError = (errorResponse: any) => {
  let errorMessage = "An unknown error occurred!";

  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMessage));
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

  return of(new AuthActions.AuthenticateFail(errorMessage));
}

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),

    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseKey, {
        email: signupAction.payload.email,
        password: signupAction.payload.password,
        returnSecureToken: true
      }).pipe(
        map(resData => {
          return handleAuthentication(Number(resData.expiresIn), resData.email, resData.localId, resData.idToken);
        }),

        catchError(errorResponse => {
          return handleError(errorResponse);
        })
      );;
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),

    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseKey, {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      }).pipe(
        map(resData => {
          return handleAuthentication(Number(resData.expiresIn), resData.email, resData.localId, resData.idToken);
        }),

        catchError(errorResponse => {
          return handleError(errorResponse);
        })
      );
    })
  );

  @Effect({
    dispatch: false
  })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.AUTH_SUCCESS),

    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {}
}