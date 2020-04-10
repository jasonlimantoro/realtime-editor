import { serviceRegistry } from "src/lib/services/registry";
import { Dispatch } from "redux";
import { crudActions } from "src/lib/redux-utils";
import {
  ClearEditing,
  DraftAction,
  DraftActionTypes,
  EditingAction,
  EditingField,
  Scope,
  Unsubscribe,
} from "./types";

const service = serviceRegistry.draft;

const onStart = (scope: Scope) => ({
  type: DraftActionTypes.SET_BEGIN,
  scope,
});

const onSuccess = (scope: Scope, payload: any) => ({
  type: DraftActionTypes.SET_SUCCESS,
  scope,
  payload,
});

const onFailure = (scope: Scope, payload: any) => ({
  type: DraftActionTypes.SET_FAILURE,
  scope,
  payload,
});

export const crud = crudActions({
  service,
  handler: {
    list: {
      onStart: () => onStart(Scope.list),
      onSuccess: (data: any) => onSuccess(Scope.list, data),
      onFailure: (error: any) => onFailure(Scope.list, error.response || error),
    },
    remove: {
      onStart: () => onStart(Scope.delete),
      onSuccess: (data: any) => onSuccess(Scope.delete, data),
      onFailure: (error: any) =>
        onFailure(Scope.delete, error.response || error),
    },
    create: {
      onStart: () => onStart(Scope.create),
      onSuccess: (data: any) => onSuccess(Scope.create, data),
      onFailure: (error: any) =>
        onFailure(Scope.create, error.response || error),
    },
    detail: {
      onStart: () => onStart(Scope.detail),
      onSuccess: (data: any) => onSuccess(Scope.detail, data),
      onFailure: (error: any) =>
        onFailure(Scope.detail, error.response || error),
    },
  },
});

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
        service.broadcastValue(data);
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

export const setEditingState = (
  field: EditingField,
  value: any
): EditingAction => ({
  type: Object(DraftActionTypes)[`SET_EDITING_${field.toUpperCase()}`],
  payload: value,
  field,
});

const subscribeEditingState = (
  field: EditingField,
  value: any
): EditingAction => ({
  type: Object(DraftActionTypes)[`SUBSCRIBE_EDITING_${field.toUpperCase()}`],
  payload: value,
  field,
});

export const listenEditorStateChange = () => (dispatch: Dispatch) => {
  service.listenValue((data: any) => {
    dispatch(subscribeEditingState("value", data.value));
  });
  service.listenTitle((data: any) => {
    dispatch(subscribeEditingState("title", data.title));
  });
  service.listenTimestamp((data: any) => {
    dispatch(subscribeEditingState("timestamp", data.updatedAt));
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
