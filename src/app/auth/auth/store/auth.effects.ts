import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, switchMap, map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AuthResponseData, AuthService } from "../auth.service";
import { UserModel } from "../user.model";
import * as AuthActions from './auth.actions';

const handleAuthentication = (expiresIn: number, email: string, userID: string, token: string) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const newUser = new UserModel(token, expirationDate, email, userID);

  localStorage.setItem('userData', JSON.stringify(newUser));

  return new AuthActions.AuthenticateSuccess({
    email, expirationDate, token, userID,
    redirect: true
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
  authAutoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),

    map(() => {
      const userData = JSON.parse(localStorage.getItem('userData'));

      if (!userData) {
        return {
          type: '-' // No other actions triggered
        };
      }

      const loadedUser = new UserModel(
        userData.rawToken,
        new Date(userData.tokenExpirationDate),
        userData.email,
        userData.id
      );

      if (loadedUser.token) {
        const expirationDuration = new Date(userData.tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);

        // this.userSubject.next(loadedUser);
        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          token: loadedUser.token,
          userID: loadedUser.id,
          expirationDate: new Date(userData.tokenExpirationDate),
          redirect: false
        });

        // this.autoLogout(expirationDuration);
      }

      return {
        type: '-' // No other actions triggered
      };
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
        tap((resData) => {
          this.authService.setLogoutTimer(Number(resData.expiresIn) * 1000);
        }),

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
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),

    tap(() => {
      localStorage.removeItem('userData');

      this.authService.clearLogoutTimer();
      this.router.navigate(['/auth']);
    })
  );

  @Effect({
    dispatch: false
  })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTH_SUCCESS),

    tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect === true) {
        this.router.navigate(['/']);
      }
    })
  );

  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),

    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseKey, {
        email: signupAction.payload.email,
        password: signupAction.payload.password,
        returnSecureToken: true
      }).pipe(
        tap((resData) => {
          this.authService.setLogoutTimer(Number(resData.expiresIn) * 1000);
        }),

        map(resData => {
          return handleAuthentication(Number(resData.expiresIn), resData.email, resData.localId, resData.idToken);
        }),

        catchError(errorResponse => {
          return handleError(errorResponse);
        })
      );;
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService
  ) {}
}