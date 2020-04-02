import produce from "immer";
import isEmpty from "lodash/isEmpty";
import { State, DraftAction, DraftActionTypes, Scope } from "./types";

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
        if (action.scope === Scope.list) {
          draft.drafts = action.payload;
        } else if (action.scope === Scope.delete) {
          draft.drafts.splice(
            draft.drafts.findIndex(({ _id: id }) => id === action.payload.id),
            1
          );
        } else if (action.scope === Scope.create) {
          if (!isEmpty(action.payload)) {
            draft.drafts.push(action.payload);
          }
        } else if (action.scope === Scope.detail) {
          const idx = draft.drafts.findIndex(
            ({ _id }) => _id === action.payload._id
          );
          if (idx === -1) {
            draft.drafts.push(action.payload);
          }
        }
        break;

      case DraftActionTypes.SET_FAILURE:
        draft[`${action.scope}Loading`] = false;
        draft[`${action.scope}Error`] = action.payload;
        break;
    }
  });

export default reducer;
