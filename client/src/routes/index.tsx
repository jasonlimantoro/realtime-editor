import React from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Todos from "./Todos";
import Editor from "./Editor";
import ListEditor from "./Editor/ListEditor";
import Login from "./Login";
import Register from "./Register";

interface Props {}

const Index: React.FC<Props> = () => {
  return (
    <Router>
      <Route path="/todos" component={Todos} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route
        exact
        path="/editor"
        render={() => <Redirect to={`/editor/${Date.now()}`} />}
      />
      <Route path="/editors" component={ListEditor} />
      <Route path="/editor/:editorId" component={Editor} />
    </Router>
  );
};

export default Index;
