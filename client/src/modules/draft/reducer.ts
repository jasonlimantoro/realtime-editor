import produce from "immer";
import isEmpty from "lodash/isEmpty";
import {
  State,
  DraftAction,
  DraftActionTypes,
  Scope,
  ListSuccessAction,
  CreateSuccessAction,
  DeleteSuccessAction,
  DetailSuccessAction,
} from "./types";

const initialState: State = {
  drafts: [],
  listLoading: false,
  listError: {},
  createLoading: false,
  createError: {},
  detailLoading: false,
  detailError: {},
  deleteLoading: false,
  deleteError: {},
  broadcastLoading: false,
  broadcastError: {},
  editing: {
    title: "",
    value: null,
    collaborators: {},
  },
};

type SuccessAction =
  | ListSuccessAction
  | CreateSuccessAction
  | DeleteSuccessAction
  | DetailSuccessAction;

const successReducer = (state = initialState, action: SuccessAction) => {
  switch (action.scope) {
    case Scope.list:
      state.drafts = action.payload;
      break;

    case Scope.create:
      if (!isEmpty(action.payload)) {
        state.drafts.push(action.payload);
      }
      break;

    case Scope.delete:
      state.drafts.splice(
        state.drafts.findIndex(({ _id: id }) => id === action.payload.id),
        1
      );
      break;

    case Scope.detail: {
      const idx = state.drafts.findIndex(
        ({ _id }) => _id === action.payload._id
      );
      if (idx === -1) {
        state.drafts.push(action.payload);
      } else {
        state.drafts[idx] = action.payload;
      }
      state.editing.title = action.payload.title;
      state.editing.value = action.payload.value;
    }
  }
};
const reducer = (state = initialState, action: DraftAction) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DraftActionTypes.SET_BEGIN:
        draft[`${action.scope}Loading`] = true;
        break;
      case DraftActionTypes.SET_SUCCESS:
        draft[`${action.scope}Loading`] = false;
        draft[`${action.scope}Error`] = {};
        successReducer(draft, action as SuccessAction);
        break;

      case DraftActionTypes.SET_FAILURE:
        draft[`${action.scope}Loading`] = false;
        draft[`${action.scope}Error`] = action.payload;
        break;

      case DraftActionTypes.SET_EDITING_TITLE:
        draft.editing.title = action.payload;
        break;

      case DraftActionTypes.SET_EDITING_VALUE:
        draft.editing.value = action.payload;
        break;
      case DraftActionTypes.CLEAR_EDITING_STATE:
        draft.editing = initialState.editing;
        break;

      case DraftActionTypes.SUBSCRIBE_NEW_COLLABORATOR:
        draft.editing.collaborators[action.payload.clientId] =
          action.payload.user;
        break;

      case DraftActionTypes.SUBSCRIBE_REMOVE_COLLABORATOR:
        delete draft.editing.collaborators[action.payload.clientId];
        break;
    }
  });

export default reducer;
