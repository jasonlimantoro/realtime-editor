import { State, TodoAction, TodoActionType } from "./types";
import produce from "immer";
import { combineReducers } from "redux";

const initialState: State = {
  todos: {},
  ids: []
};

const todos = (state = initialState.todos, action: TodoAction) =>
  produce(state, draft => {
    switch (action.type) {
      case TodoActionType.ADD:
        draft[action.payload.todo.id] = action.payload.todo;
        break;

      case TodoActionType.REMOVE:
        delete draft[action.payload.id];
        break;
      case TodoActionType.UPDATE:
        draft[action.payload.id].body = action.payload.body;
        break;
    }
  });

const ids = (state = initialState.ids, action: TodoAction) =>
  produce(state, draft => {
    switch (action.type) {
      case TodoActionType.ADD:
        draft.push(action.payload.todo.id);
        break;
      case TodoActionType.REMOVE:
        draft.splice(
          draft.findIndex(id => id === action.payload.id),
          1
        );
        break;
    }
  });

export default combineReducers({
  todos,
  ids
});
