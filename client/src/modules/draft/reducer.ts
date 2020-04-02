import produce from "immer";
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
        }
        break;

      case DraftActionTypes.SET_FAILURE:
        draft[`${action.scope}Loading`] = false;
        draft[`${action.scope}Error`] = action.payload;
        break;
    }
  });

export default reducer;
