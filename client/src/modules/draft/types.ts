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
  broadcast = "broadcast",
}

export enum DraftActionTypes {
  SET_BEGIN = "DRAFT/SET_BEGIN",
  SET_SUCCESS = "DRAFT/SET_SUCCESS",
  SET_FAILURE = "DRAFT/SET_FAILURE",

  SET_EDITING_TITLE = "DRAFT/SET_EDITING_TITLE",
  SET_EDITING_VALUE = "DRAFT/SET_EDITING_VALUE",
  CLEAR_EDITING_STATE = "DRAFT/CLEAR_EDITING_STATE",

  SUBSCRIBE_NEW_COLLABORATOR = "DRAFT/SUBSCRIBE_NEW_COLLABORATOR",
  SUBSCRIBE_REMOVE_COLLABORATOR = "DRAFT/SUBSCRIBE_REMOVE_COLLABORATOR",
  UNLISTEN = "DRAFT/UNLISTEN",
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

export interface BroadcastBegin {
  type: DraftActionTypes.SET_BEGIN;
  scope: Scope.broadcast;
  event: string;
  payload: any;
}

export interface BroadcastSuccess {
  type: DraftActionTypes.SET_SUCCESS;
  scope: Scope.broadcast;
  event: string;
}

export interface BroadcastError {
  type: DraftActionTypes.SET_FAILURE;
  scope: Scope.broadcast;
  event: string;
  payload: any;
}

export interface EditingTitle {
  type: DraftActionTypes.SET_EDITING_TITLE;
  payload: string;
}

export interface EditingValue {
  type: DraftActionTypes.SET_EDITING_VALUE;
  payload: any;
}

export interface Unlisten {
  type: DraftActionTypes.UNLISTEN;
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

type BroadcastAction = BroadcastBegin | BroadcastSuccess | BroadcastError;

type EditingAction = EditingTitle | EditingValue | ClearEditing;

type UnlistenAction = Unlisten;

type SubscribeAction = SubscribeNewCollaborator | SubscribeRemoveCollaborator;

export type DraftAction =
  | ListAction
  | DeleteAction
  | CreateAction
  | DetailAction
  | BroadcastAction
  | EditingAction
  | UnlistenAction
  | SubscribeAction;
