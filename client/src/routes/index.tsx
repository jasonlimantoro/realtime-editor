import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Todos from "./Todos";
import Editor from "./Editor";

interface Props {}

const Index: React.FC<Props> = () => {
  return (
    <Router>
      <Route path="/todos" component={Todos} />
      <Route path="/editor" component={Editor} />
    </Router>
  );
};

export default Index;
