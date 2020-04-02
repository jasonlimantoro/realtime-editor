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
  LIST_BEGIN = "DRAFT/LIST_BEGIN",
  LIST_SUCCESS = "DRAFT/LIST_SUCCESS",
  LIST_FAILURE = "DRAFT/LIST_FAILURE",
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

type ListAction = ListBeginAction | ListSuccessAction | ListFailureAction;
type DeleteAction =
  | DeleteBeginAction
  | DeleteSuccessAction
  | DeleteFailureAction;

export type DraftAction = ListAction | DeleteAction;
