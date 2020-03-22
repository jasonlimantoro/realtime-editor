export interface Todo {
  id: string;
  body: string;
}

export enum TodoActionType {
  ADD = "TODO/ADD",
  REMOVE = "TODO/REMOVE",
  UPDATE = "TODO/UPDATE"
}

interface NormalizedTodo {
  [key: string]: Todo;
}

export interface State {
  todos: NormalizedTodo;
  ids: string[];
}

export interface AddTodo {
  type: TodoActionType.ADD;
  payload: {
    todo: Todo;
  };
}

export interface RemoveTodo {
  type: TodoActionType.REMOVE;
  payload: {
    id: string;
  };
}

export interface UpdateTodo {
  type: TodoActionType.UPDATE;
  payload: {
    id: string;
    body: string;
  };
}

export type TodoAction = AddTodo | RemoveTodo | UpdateTodo;
