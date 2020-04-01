import { tryCatch } from "src/lib/utils";
import { Dispatch } from "redux";
import { serviceRegistry } from "src/lib/services/registry";
import CustomStorage from "src/lib/storage";
import { AuthActionType, HydrateAction, LogoutAction } from "./types";

const service = serviceRegistry.auth;
const storage = new CustomStorage();

export const login = (username: string, password: string) => async (
  dispatch: Dispatch
) => {
  dispatch({
    type: AuthActionType.LOGIN_BEGIN,
    payload: { username, password },
  });
  await tryCatch(() => service.login(username, password))({
    successFn(response) {
      dispatch({
        type: AuthActionType.LOGIN_SUCCESS,
        payload: response.data,
      });
      storage.saveCredentials(response.data.user);
    },
    errorFn(err) {
      dispatch({
        type: AuthActionType.LOGIN_FAILURE,
        payload: err.response,
      });
    },
  });
};

export const register = (username: string, password: string) => async (
  dispatch: Dispatch
) => {
  dispatch({
    type: AuthActionType.REGISTER_BEGIN,
    payload: { username, password },
  });
  await tryCatch(() => service.register(username, password))({
    successFn(response) {
      dispatch({
        type: AuthActionType.REGISTER_SUCCESS,
        payload: response.data,
      });
    },
    errorFn(err) {
      dispatch({
        type: AuthActionType.REGISTER_FAILURE,
        payload: err.response,
      });
    },
  });
};

export const logout = (): LogoutAction => {
  storage.flushCredentials();
  return {
    type: AuthActionType.LOGOUT,
  };
};

export const hydrate = (): HydrateAction => {
  const credentials = storage.getCredentials();
  return {
    type: AuthActionType.HYDRATE,
    payload: credentials,
  };
};
