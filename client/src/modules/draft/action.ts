import { serviceRegistry } from "src/lib/services/registry";
import { Dispatch } from "redux";
import { tryCatch } from "src/lib/utils";
import { DraftActionTypes, Scope } from "./types";

const service = serviceRegistry.draft;

export const list = () => async (dispatch: Dispatch) => {
  dispatch({
    type: DraftActionTypes.SET_BEGIN,
    scope: Scope.list,
  });
  await tryCatch(() => service.list())({
    successFn(resp) {
      dispatch({
        type: DraftActionTypes.SET_SUCCESS,
        payload: resp.data,
        scope: Scope.list,
      });
    },
    errorFn(err) {
      dispatch({
        type: DraftActionTypes.SET_FAILURE,
        payload: err.response,
        scope: Scope.list,
      });
    },
  });
};

export const remove = (id: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: DraftActionTypes.SET_BEGIN,
    scope: Scope.delete,
  });
  await tryCatch(() => service.destroy(id))({
    successFn() {
      dispatch({
        type: DraftActionTypes.SET_SUCCESS,
        payload: {
          id,
        },
        scope: Scope.delete,
      });
    },
    errorFn(err) {
      dispatch({
        type: DraftActionTypes.SET_FAILURE,
        payload: err.response,
        scope: Scope.delete,
      });
    },
  });
};

export const create = (body: any) => async (dispatch: Dispatch) => {
  dispatch({
    type: DraftActionTypes.SET_BEGIN,
    scope: Scope.create,
    payload: body,
  });
  await tryCatch(() => service.create(body))({
    successFn(resp) {
      dispatch({
        type: DraftActionTypes.SET_SUCCESS,
        payload: resp.data,
        scope: Scope.create,
      });
    },
    errorFn(err) {
      dispatch({
        type: DraftActionTypes.SET_FAILURE,
        payload: err.response,
        scope: Scope.create,
      });
    },
  });
};

export const detail = (id: string) => async (dispatch: Dispatch) => {
  dispatch({
    type: DraftActionTypes.SET_BEGIN,
    scope: Scope.detail,
    payload: id,
  });
  await tryCatch(() => service.detail(id))({
    successFn(resp) {
      dispatch({
        type: DraftActionTypes.SET_SUCCESS,
        payload: resp.data,
        scope: Scope.detail,
      });
    },
    errorFn(err) {
      dispatch({
        type: DraftActionTypes.SET_FAILURE,
        payload: err.response,
        scope: Scope.detail,
      });
    },
  });
};
