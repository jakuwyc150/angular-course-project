import { UserModel } from "../user.model";
import * as AuthActions from "./auth.actions";

export interface State {
  user: UserModel;
}

const initialState: State = {
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
        user: newUser
      };
    }

    case AuthActions.LOGOUT: {
      return {
        ...state,
        user: null
      };
    }

    default: return state;
  }
}