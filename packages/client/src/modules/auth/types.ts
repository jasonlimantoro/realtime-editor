import { User } from "src/lib/entities/User";

export enum AuthActionType {
  LOGIN_BEGIN = "AUTH/LOGIN_BEGIN",
  LOGIN_SUCCESS = "AUTH/LOGIN_SUCCESS",
  LOGIN_FAILURE = "AUTH/LOGIN_FAILURE",

  REGISTER_BEGIN = "AUTH/REGISTER_BEGIN",
  REGISTER_SUCCESS = "AUTH/REGISTER_SUCCESS",
  REGISTER_FAILURE = "AUTH/REGISTER_FAILURE",

  LOGOUT = "AUTH/LOGOUT",

  HYDRATE = "AUTH/HYDRATE",
}

export interface State {
  isLoggedIn: boolean;
  credentials: User;
  loginLoading: boolean;
  loginError: any;
  registerLoading: boolean;
  registerError: any;
  logoutReason: string;
}

export interface LoginBegin {
  type: AuthActionType.LOGIN_BEGIN;
  payload: any;
}

export interface LoginSuccess {
  type: AuthActionType.LOGIN_SUCCESS;
  payload: {
    user: User;
  };
}

export interface LoginFailure {
  type: AuthActionType.LOGIN_FAILURE;
  payload: any;
}

export interface RegisterBegin {
  type: AuthActionType.REGISTER_BEGIN;
  payload: any;
}

export interface RegisterSuccess {
  type: AuthActionType.REGISTER_SUCCESS;
  payload: any;
}

export interface RegisterFailure {
  type: AuthActionType.REGISTER_FAILURE;
  payload: any;
}

export interface HydrateAction {
  type: AuthActionType.HYDRATE;
  payload: User;
}

export interface LogoutAction {
  type: AuthActionType.LOGOUT;
  payload: {
    reason: string;
  };
}

export type AuthAction =
  | LoginBegin
  | LoginFailure
  | LoginSuccess
  | RegisterBegin
  | RegisterSuccess
  | RegisterFailure
  | HydrateAction
  | LogoutAction;