import { UserModel } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
  authError: string;
  loading: boolean;
  user: UserModel;
}

const initialState: State = {
  authError: null,
  loading: false,
  user: null
};

export function authReducer(state = initialState, action: AuthActions.AuthActions): State {
  switch (action.type) {
    case AuthActions.AUTH_SUCCESS: {
      const newUser = new UserModel(
        (action as AuthActions.AuthenticateSuccess).payload.token,
        (action as AuthActions.AuthenticateSuccess).payload.expirationDate,
        (action as AuthActions.AuthenticateSuccess).payload.email,
        (action as AuthActions.AuthenticateSuccess).payload.userID
      );

      return {
        ...state,
        authError: null,
        user: newUser
      };
    }

    case AuthActions.AUTH_FAIL: {
      return {
        ...state,
        authError: (action as AuthActions.AuthenticateFail).payload,
        loading: false,
        user: null
      };
    }

    case AuthActions.LOGIN_START: {
      return {
        ...state,
        authError: null,
        loading: true
      };
    }

    case AuthActions.LOGOUT: {
      return {
        ...state,
        authError: null,
        user: null
      };
    }

    default: return state;
  }
}