import { serviceRegistry } from "src/lib/services/registry";
import { Dispatch } from "redux";
import { tryCatch } from "src/lib/utils";
import {
  DraftActionTypes,
  Scope,
  Unlisten,
  BroadcastBegin,
  BroadcastSuccess,
  BroadcastError,
  ClearEditing,
  EditingTitle,
  EditingValue,
  SubscribeNewCollaborator,
  SubscribeRemoveCollaborator,
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

const fieldToEventName: { [key: string]: string } = {
  value: service.CHANGE_STATE,
  title: service.CHANGE_TITLE,
  room: service.CREATE_ROOM,
};

export const broadcast = ({
  field = "value",
  data,
  meta,
}: {
  field: string;
  data: any;
  meta?: any;
}) => {
  const broadcaster: { [key: string]: Function } = {
    value: service.broadcastState,
    title: service.broadcastTitle,
    room: service.createRoom,
  };

  return async (dispatch: Dispatch) => {
    dispatch<BroadcastBegin>({
      type: DraftActionTypes.SET_BEGIN,
      scope: Scope.broadcast,
      event: fieldToEventName[field],
      payload: data,
    });
    await tryCatch(() => broadcaster[field]({ ...data, meta }))({
      successFn() {
        dispatch<BroadcastSuccess>({
          type: DraftActionTypes.SET_SUCCESS,
          scope: Scope.broadcast,
          event: fieldToEventName[field],
        });
      },
      errorFn(err) {
        dispatch<BroadcastError>({
          type: DraftActionTypes.SET_FAILURE,
          scope: Scope.broadcast,
          event: fieldToEventName[field],
          payload: err,
        });
      },
    });
  };
};

export const listen = ({ field = "value" }) => {
  const listener: { [key: string]: Function } = {
    title: service.listenTitle,
    value: service.listenState,
  };
  const fieldToActionType: { [key: string]: string } = {
    title: DraftActionTypes.SET_EDITING_TITLE,
    value: DraftActionTypes.SET_EDITING_VALUE,
  };
  return async (dispatch: Dispatch) => {
    listener[field]((data: any) => {
      dispatch({
        type: fieldToActionType[field],
        payload: data[field],
      });
    });
  };
};

export const unlisten = (): Unlisten => {
  service.requestUtil.unlistenAll();
  return {
    type: DraftActionTypes.UNLISTEN,
  };
};

export const clearEditingValue = (): ClearEditing => ({
  type: DraftActionTypes.CLEAR_EDITING_STATE,
});

export const setEditingTitle = (title: string): EditingTitle => ({
  type: DraftActionTypes.SET_EDITING_TITLE,
  payload: title,
});

export const setEditingValue = (value: any): EditingValue => ({
  type: DraftActionTypes.SET_EDITING_VALUE,
  payload: value,
});

export const listenCollaboratorChange = () => (dispatch: Dispatch) => {
  service.listenNewCollaborator((data: any) => {
    dispatch<SubscribeNewCollaborator>({
      type: DraftActionTypes.SUBSCRIBE_NEW_COLLABORATOR,
      payload: data,
    });
  });
  service.listenRemoveCollaborator((data: any) => {
    dispatch<SubscribeRemoveCollaborator>({
      type: DraftActionTypes.SUBSCRIBE_REMOVE_COLLABORATOR,
      payload: data,
    });
  });
};

export const leave = (data: any) => (dispatch: Dispatch) => {
  service.leaveRoom(data);
  dispatch<BroadcastSuccess>({
    type: DraftActionTypes.SET_SUCCESS,
    scope: Scope.broadcast,
    event: service.LEAVE_ROOM,
  });
};
