import React from "react";
import { Redirect, Route } from "react-router-dom";

interface GuardProps {
  protect: boolean;
  to: string;
}

type Props = GuardProps;

const Guard: React.FC<Props> = ({ protect, to, ...rest }) => {
  if (protect) {
    return <Redirect to={to} />;
  }
  return <Route {...rest} />;
};

export default Guard;
