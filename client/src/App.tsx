import React from "react";
import { connect } from "react-redux";
import { AppState } from "./modules/types";
import { Todo } from "./modules/todo/types";
import { addTodo, removeTodo, updateTodo } from "./modules/todo/action";
import { selectTodos } from "./modules/todo/selector";
import produce from "immer";

interface AppProps {}

type Props = AppProps & LinkMapStateProps & LinkMapDispatchProps;

const App: React.FC<Props> = ({ todos, addTodo, removeTodo, updateTodo }) => {
  const [todo, setTodo] = React.useState("");
  const [isEditing, setIsEditing] = React.useState<{ [k: string]: boolean }>(
    {}
  );
  const [todoEditValues, setTodoEditValues] = React.useState<{
    [k: string]: string;
  }>({});

  const handleChange = ({
    target: { value }
  }: React.ChangeEvent<HTMLInputElement>) => {
    setTodo(value);
  };
  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (todo === "") return;
    addTodo(todo);
    setTodo("");
  };
  const handleEdit = (id: string) => {
    setIsEditing(s =>
      produce(s, draft => {
        draft[id] = true;
      })
    );
    const todo = getTodo(id);
    setTodoEditValues(v =>
      produce(v, draft => {
        draft[id] = todo.body;
      })
    );
  };

  const getTodo = (id: string) => {
    const todoIndex = todos.findIndex(t => t.id === id);
    return todos[todoIndex];
  };

  const handleEditTodo = (id: string) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    e.persist();
    setTodoEditValues(v =>
      produce(v, draft => {
        draft[id] = e.target.value;
      })
    );
  };

  const handleUpdateTodo = (id: string) => {
    setIsEditing(s =>
      produce(s, draft => {
        draft[id] = false;
      })
    );
    updateTodo(id, todoEditValues[id] as string);
  };

  const handleRemoveTodo = (id: string) => {
    setIsEditing(s =>
      produce(s, draft => {
        delete draft[id];
      })
    );
    setTodoEditValues(v =>
      produce(v, draft => {
        delete draft[id];
      })
    );
    removeTodo(id);
  };

  return (
    <div>
      Todos({todos.length})
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="todo">Todo</label>
          <input id="todo" type="text" onChange={handleChange} value={todo} />
        </div>
        <button type="submit">Submit</button>
      </form>
      <ul>
        {todos.map(({ body, id }, idx) => {
          return isEditing[id] ? (
            <div key={id}>
              <input
                type="text"
                value={todoEditValues[id] || ""}
                onChange={handleEditTodo(id)}
              />
              <button onClick={() => handleUpdateTodo(id)}>Update</button>
            </div>
          ) : (
            <div key={idx}>
              <li onClick={() => handleEdit(id)}>{body}</li>
              <button onClick={() => handleRemoveTodo(id)}>Delete</button>
            </div>
          );
        })}
      </ul>
    </div>
  );
};

interface LinkMapStateProps {
  todos: Todo[];
}

interface LinkMapDispatchProps {
  addTodo: (body: string) => void;
  removeTodo: (id: string) => void;
  updateTodo: (id: string, body: string) => void;
}

const mapStateToProps = (state: AppState): LinkMapStateProps => ({
  todos: selectTodos(state)
});

const mapDispatchToProps: LinkMapDispatchProps = {
  addTodo,
  removeTodo,
  updateTodo
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
