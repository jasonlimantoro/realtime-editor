import produce from "immer";
import { State, AuthAction, AuthActionType } from "./types";

const initialState: State = {
  loginLoading: false,
  loginError: {},

  registerLoading: false,
  registerError: {},

  isLoggedIn: false,
  credentials: {
    token: "",
    username: "",
  },
};

const reducer = (state = initialState, action: AuthAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case AuthActionType.LOGIN_BEGIN:
        draft.loginLoading = true;
        break;
      case AuthActionType.LOGIN_SUCCESS:
        draft.loginLoading = false;
        draft.isLoggedIn = true;
        draft.credentials = { ...draft.credentials, ...action.payload.user };
        draft.loginError = {};
        break;
      case AuthActionType.LOGIN_FAILURE:
        draft.loginLoading = false;
        draft.loginError = action.payload;
        draft.credentials = {};
        break;

      case AuthActionType.REGISTER_BEGIN:
        draft.registerLoading = true;
        break;
      case AuthActionType.REGISTER_SUCCESS:
        draft.registerLoading = false;
        draft.registerError = {};
        break;
      case AuthActionType.REGISTER_FAILURE:
        draft.registerError = action.payload;
        break;

      case AuthActionType.LOGOUT:
        draft.isLoggedIn = false;
        draft.credentials = {};
        break;

      case AuthActionType.HYDRATE: {
        const { token } = action.payload;
        draft.isLoggedIn = !!token;
        draft.credentials.token = token || "";
        break;
      }
    }
  });

export default reducer;
