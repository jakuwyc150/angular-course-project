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
    case AuthActions.LOGIN: {
      const newUser = new UserModel(
        (action as AuthActions.Login).payload.token,
        (action as AuthActions.Login).payload.expirationDate,
        (action as AuthActions.Login).payload.email,
        (action as AuthActions.Login).payload.userID
      );

      return {
        ...state,
        authError: null,
        user: newUser
      };
    }

    case AuthActions.LOGIN_FAIL: {
      return {
        ...state,
        authError: (action as AuthActions.LoginFail).payload,
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