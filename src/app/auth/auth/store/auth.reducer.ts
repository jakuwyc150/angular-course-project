import { UserModel } from "../user.model";

export interface State {
  userSubject: UserModel;
}

const initialState: State = {
  userSubject: null
};

export function authReducer(state = initialState, action): State {
  return state;
}