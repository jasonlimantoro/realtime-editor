import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Todos from "./Todos";

interface Props {}

const Index: React.FC<Props> = () => {
  return (
    <Router>
      <Route path="/todos" component={Todos} />
    </Router>
  );
};

export default Index;
