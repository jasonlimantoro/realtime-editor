import React from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
import { hot } from "react-hot-loader/root";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import { AuthGuard, GuestGuard } from "src/components/Guard";
import Editor from "./Editor";
import ListEditor from "./Editor/ListEditor";
import Login from "./Login";
import Register from "./Register";

interface Props {}

const Index: React.FC<Props> = () => {
  return (
    <Router>
      <Switch>
        <GuestGuard path="/login" component={Login} />
        <GuestGuard path="/register" component={Register} />
        <AuthGuard
          exact
          path="/editor"
          render={() => <Redirect to={`/editor/${Date.now()}`} />}
        />
        <AuthGuard path="/editors" component={ListEditor} />
        <AuthGuard path="/editor/:editorId" component={Editor} />
        <Route render={() => <h1 className="text-3xl">Not Found</h1>} />
      </Switch>
    </Router>
  );
};

export default hot(Index);
