import { tryCatch } from "src/lib/utils";
import { Dispatch } from "redux";
import { serviceRegistry } from "src/lib/services/registry";
import CustomStorage from "src/lib/storage";
import { AuthActionType } from "./types";

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
      storage.saveToken(response.data.user.token);
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
