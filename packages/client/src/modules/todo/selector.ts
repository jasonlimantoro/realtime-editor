import { createSelector } from "reselect";
import { AppState } from "src/modules/types";

const selectTodoDetail = (state: AppState) => state.todo.todos;
const selectTodoIds = (state: AppState) => state.todo.ids;

export const selectTodos = createSelector(
  selectTodoDetail,
  selectTodoIds,
  (todos, ids) => ids.map(id => todos[id])
);
