import { v4 } from "uuid";
import { AddTodo, RemoveTodo, TodoActionType, UpdateTodo } from "./types";

export const addTodo = (body: string): AddTodo => ({
  type: TodoActionType.ADD,
  payload: {
    todo: {
      id: v4(),
      body
    }
  }
});

export const removeTodo = (id: string): RemoveTodo => ({
  type: TodoActionType.REMOVE,
  payload: {
    id
  }
});

export const updateTodo = (id: string, body: string): UpdateTodo => ({
  type: TodoActionType.UPDATE,
  payload: {
    id,
    body
  }
});
