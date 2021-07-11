import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap, map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthResponseData } from "../auth.service";
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
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
          const expirationDate = new Date(new Date().getTime() + Number(resData.expiresIn) * 1000);
          return new AuthActions.Login({
            email: resData.email,
            userID: resData.localId,
            token: resData.idToken,
            expirationDate
          });
        }),

        catchError(errorResponse => {
          let errorMessage = "An unknown error occurred!";

          if (!errorResponse.error || !errorResponse.error.error) {
            return of(new AuthActions.LoginFail(errorMessage));
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

          return of(new AuthActions.LoginFail(errorMessage));
        })
      );
    })
  );

  @Effect({
    dispatch: false
  })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),

    tap(() => {
      this.router.navigate(['/']);
    })
  );

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) { }
}