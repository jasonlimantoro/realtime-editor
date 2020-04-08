import { DraftSchema } from "src/lib/entities/draft";

export interface State {
  drafts: DraftSchema[];
  listLoading: boolean;
  listError: {};
  createLoading: boolean;
  createError: {};
  detailLoading: boolean;
  detailError: {};
  deleteLoading: boolean;
  deleteError: {};
  broadcastLoading: boolean;
  broadcastError: {};
  editing: {
    title: string;
    value: any;
    timestamp: any;
    collaborators: {
      [key: string]: string;
    };
  };
  [key: string]: any;
}

export enum Scope {
  list = "list",
  create = "create",
  detail = "detail",
  delete = "delete",
}

export enum DraftActionTypes {
  SET_BEGIN = "DRAFT/SET_BEGIN",
  SET_SUCCESS = "DRAFT/SET_SUCCESS",
  SET_FAILURE = "DRAFT/SET_FAILURE",
  CLEAR_EDITING_STATE = "DRAFT/CLEAR_EDITING_STATE",

  BROADCAST_TITLE = "DRAFT/BROADCAST_TITLE",
  BROADCAST_VALUE = "DRAFT/BROADCAST_VALUE",
  BROADCAST_JOIN = "DRAFT/BROADCAST_JOIN",
  BROADCAST_LEAVE = "DRAFT/BROADCAST_LEAVE",

  SET_EDITING_TITLE = "DRAFT/SET_EDITING_TITLE",
  SET_EDITING_VALUE = "DRAFT/SET_EDITING_VALUE",
  SET_EDITING_TIMESTAMP = "DRAFT/SET_EDITING_TIMESTAMP",

  SUBSCRIBE_EDITING_TITLE = "DRAFT/SUBSCRIBE_EDITING_TITLE",
  SUBSCRIBE_EDITING_VALUE = "DRAFT/SUBSCRIBE_EDITING_VALUE",
  SUBSCRIBE_EDITING_TIMESTAMP = "DRAFT/SUBSCRIBE_EDITING_TIMESTAMP",
  SUBSCRIBE_NEW_COLLABORATOR = "DRAFT/SUBSCRIBE_NEW_COLLABORATOR",
  SUBSCRIBE_REMOVE_COLLABORATOR = "DRAFT/SUBSCRIBE_REMOVE_COLLABORATOR",
  UNSUBSCRIBE = "DRAFT/UNSUBSCRIBE",
}

export interface ListBeginAction {
  type: DraftActionTypes.SET_BEGIN;
  scope: Scope.list;
}

export interface ListSuccessAction {
  type: DraftActionTypes.SET_SUCCESS;
  scope: Scope.list;
  payload: DraftSchema[];
}

export interface ListFailureAction {
  type: DraftActionTypes.SET_FAILURE;
  scope: Scope.list;
  payload: any;
}

export interface DeleteBeginAction {
  type: DraftActionTypes.SET_BEGIN;
  scope: Scope.delete;
}

export interface DeleteSuccessAction {
  type: DraftActionTypes.SET_SUCCESS;
  scope: Scope.delete;
  payload: {
    id: string;
  };
}

export interface DeleteFailureAction {
  type: DraftActionTypes.SET_FAILURE;
  scope: Scope.delete;
  payload: any;
}

export interface DetailBeginAction {
  type: DraftActionTypes.SET_BEGIN;
  scope: Scope.detail;
  payload: any;
}

export interface DetailSuccessAction {
  type: DraftActionTypes.SET_SUCCESS;
  scope: Scope.detail;
  payload: DraftSchema;
}

export interface DetailFailureAction {
  type: DraftActionTypes.SET_FAILURE;
  scope: Scope.detail;
  payload: any;
}

export interface CreateBeginAction {
  type: DraftActionTypes.SET_BEGIN;
  scope: Scope.create;
  payload: any;
}

export interface CreateSuccessAction {
  type: DraftActionTypes.SET_SUCCESS;
  scope: Scope.create;
  payload: DraftSchema;
}

export interface CreateFailureAction {
  type: DraftActionTypes.SET_FAILURE;
  scope: Scope.create;
  payload: any;
}

export interface BroadcastTitle {
  type: DraftActionTypes.BROADCAST_TITLE;
  payload: any;
}

export interface BroadcastValue {
  type: DraftActionTypes.BROADCAST_VALUE;
  payload: any;
}

export interface BroadcastJoin {
  type: DraftActionTypes.BROADCAST_JOIN;
  payload: any;
}

export interface BroadcastLeave {
  type: DraftActionTypes.BROADCAST_LEAVE;
  payload: any;
}

export interface SetEditingTitle {
  type: DraftActionTypes.SET_EDITING_TITLE;
  payload: string;
}
export interface SetEditingValue {
  type: DraftActionTypes.SET_EDITING_VALUE;
  payload: any;
}

export interface SetEditingTimestamp {
  type: DraftActionTypes.SET_EDITING_TIMESTAMP;
  payload: any;
}

export interface SubscribeEditingTitle {
  type: DraftActionTypes.SUBSCRIBE_EDITING_TITLE;
  payload: string;
}

export interface SubscribeEditingTimestamp {
  type: DraftActionTypes.SUBSCRIBE_EDITING_TIMESTAMP;
  payload: any;
}

export interface SubscribeEditingValue {
  type: DraftActionTypes.SUBSCRIBE_EDITING_VALUE;
  payload: any;
}

export interface Unsubscribe {
  type: DraftActionTypes.UNSUBSCRIBE;
  event?: string;
}

export interface ClearEditing {
  type: DraftActionTypes.CLEAR_EDITING_STATE;
}

export interface SubscribeNewCollaborator {
  type: DraftActionTypes.SUBSCRIBE_NEW_COLLABORATOR;
  payload: {
    user: string;
    clientId: string;
    collaborators: any;
  };
}

export interface SubscribeRemoveCollaborator {
  type: DraftActionTypes.SUBSCRIBE_REMOVE_COLLABORATOR;
  payload: {
    user: string;
    clientId: string;
  };
}

type ListAction = ListBeginAction | ListSuccessAction | ListFailureAction;
type DeleteAction =
  | DeleteBeginAction
  | DeleteSuccessAction
  | DeleteFailureAction;

type CreateAction =
  | CreateBeginAction
  | CreateSuccessAction
  | CreateFailureAction;

type DetailAction =
  | DetailBeginAction
  | DetailSuccessAction
  | DetailFailureAction;

type BroadcastAction =
  | BroadcastTitle
  | BroadcastValue
  | BroadcastJoin
  | BroadcastLeave;

type EditingAction =
  | SubscribeEditingTitle
  | SubscribeEditingValue
  | SetEditingValue
  | SetEditingTitle
  | SetEditingTimestamp
  | ClearEditing;

type UnsubscribeAction = Unsubscribe;

type SubscribeAction =
  | SubscribeNewCollaborator
  | SubscribeRemoveCollaborator
  | SubscribeEditingTitle
  | SubscribeEditingValue
  | SubscribeEditingTimestamp;

export type DraftAction =
  | ListAction
  | DeleteAction
  | CreateAction
  | DetailAction
  | BroadcastAction
  | EditingAction
  | UnsubscribeAction
  | SubscribeAction;
