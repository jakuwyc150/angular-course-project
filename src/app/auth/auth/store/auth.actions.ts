import { Action } from "@ngrx/store";

export const AUTH_SUCCESS = '[AUTH] AUTH_SUCCESS'; // Authentication (login or signup) successed
export const AUTH_FAIL = '[AUTH] AUTH_FAIL'; // Authentication failed
export const AUTO_LOGIN = '[AUTH] AUTO_LOGIN';
export const CLEAR_ERROR = '[AUTH] CLEAR_ERROR';
export const LOGIN_START = '[AUTH] LOGIN_START'; // Login start, sending HTTP request
export const LOGOUT = '[AUTH] LOGOUT';
export const SIGNUP_START = '[AUTH] SIGNUP_START';

export class AuthenticateSuccess implements Action {
  readonly type: string = AUTH_SUCCESS;

  constructor(
    public payload: {
      email: string,
      userID: string,
      token: string,
      expirationDate: Date,
      redirect: boolean
    }
  ) {}
}

export class AuthenticateFail implements Action {
  readonly type: string = AUTH_FAIL;

  constructor(public payload: string) {}
}

export class AutoLogin implements Action {
  readonly type: string = AUTO_LOGIN;
}

export class ClearError implements Action {
  readonly type: string = CLEAR_ERROR;
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

export class SignupStart implements Action {
  readonly type: string = SIGNUP_START;

  constructor(public payload: {
    email: string,
    password: string
  }) {}
}

export type AuthActions =
  AuthenticateSuccess |
  AuthenticateFail |
  AutoLogin |
  ClearError |
  LoginStart |
  Logout |
  SignupStart;