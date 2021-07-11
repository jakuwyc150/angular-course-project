import { Action } from "@ngrx/store";

export const LOGIN = '[AUTH] LOGIN'; // Login successed
export const LOGIN_FAIL = '[AUTH] LOGIN_FAIL'; // Login failed
export const LOGIN_START = '[AUTH] LOGIN_START'; // Sending HTTP request
export const LOGOUT = '[AUTH] LOGOUT';

export class Login implements Action {
  readonly type: string = LOGIN;

  constructor(
    public payload: {
      email: string,
      userID: string,
      token: string,
      expirationDate: Date
    }
  ) {}
}

export class LoginFail implements Action {
  readonly type: string = LOGIN_FAIL;

  constructor(public payload: string) {}
}

export class LoginStart implements Action {
  readonly type: string = LOGIN_START;

  constructor(public payload: {
    email: string,
    password: string
  }) {}
}

export class Logout implements Action {
  readonly type: string = LOGOUT;
}

export type AuthActions =
  Login |
  LoginFail |
  LoginStart |
  Logout;