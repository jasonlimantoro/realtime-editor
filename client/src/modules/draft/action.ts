import { serviceRegistry } from "src/lib/services/registry";
import { Dispatch } from "redux";
import { RawDraftContentState } from "draft-js";
import { tryCatch } from "src/lib/utils";
import {
  ClearEditing,
  DraftAction,
  DraftActionTypes,
  Scope,
  SetEditingTitle,
  SetEditingValue,
  SubscribeEditingTitle,
  SubscribeEditingValue,
  Unsubscribe,
} from "./types";

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
      console.error(err);
      dispatch({
        type: DraftActionTypes.SET_FAILURE,
        payload: err.response || err,
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

export const broadcast = ({
  type = "value",
  data,
}: {
  type: "value" | "title";
  data: any;
}) => {
  return async (dispatch: Dispatch) => {
    switch (type) {
      case "value":
        dispatch<DraftAction>({
          type: DraftActionTypes.BROADCAST_VALUE,
          payload: data,
        });
        service.broadcastState(data);
        break;
      case "title":
        dispatch<DraftAction>({
          type: DraftActionTypes.BROADCAST_TITLE,
          payload: data,
        });
        service.broadcastTitle(data);
        break;
    }
  };
};

export const unsubscribe = (): Unsubscribe => {
  service.requestUtil.unlistenAll();
  return {
    type: DraftActionTypes.UNSUBSCRIBE,
  };
};

export const clearEditingValue = (): ClearEditing => ({
  type: DraftActionTypes.CLEAR_EDITING_STATE,
});

export const setEditingTitle = (title: string): SetEditingTitle => ({
  type: DraftActionTypes.SET_EDITING_TITLE,
  payload: title,
});

export const setEditingValue = (
  value: RawDraftContentState
): SetEditingValue => ({
  type: DraftActionTypes.SET_EDITING_VALUE,
  payload: value,
});

const subscribeEditingTitle = (title: string): SubscribeEditingTitle => ({
  type: DraftActionTypes.SUBSCRIBE_EDITING_TITLE,
  payload: title,
});

const subscribeEditingValue = (value: any): SubscribeEditingValue => ({
  type: DraftActionTypes.SUBSCRIBE_EDITING_VALUE,
  payload: value,
});

export const listenEditorStateChange = () => (dispatch: Dispatch) => {
  service.listenState((data: any) => {
    dispatch(subscribeEditingValue(data.value));
  });
  service.listenTitle((data: any) => {
    dispatch(subscribeEditingTitle(data.title));
  });
};
export const listenCollaboratorChange = () => (dispatch: Dispatch) => {
  service.listenNewCollaborator((data: any) => {
    dispatch<DraftAction>({
      type: DraftActionTypes.SUBSCRIBE_NEW_COLLABORATOR,
      payload: data,
    });
  });
  service.listenRemoveCollaborator((data: any) => {
    dispatch<DraftAction>({
      type: DraftActionTypes.SUBSCRIBE_REMOVE_COLLABORATOR,
      payload: data,
    });
  });
};

export const join = (data: any) => (dispatch: Dispatch) => {
  service.createRoom(data);
  dispatch<DraftAction>({
    type: DraftActionTypes.BROADCAST_JOIN,
    payload: data,
  });
};
export const leave = (data: any) => (dispatch: Dispatch) => {
  service.leaveRoom(data);
  dispatch<DraftAction>({
    type: DraftActionTypes.BROADCAST_LEAVE,
    payload: data,
  });
};
