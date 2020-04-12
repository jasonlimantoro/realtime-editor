import React from "react";
import { Guard } from "rc-common";
import { RouteProps } from "react-router-dom";
import { observer } from "mobx-react";
import { selectIsLoggedIn, useComposeAuth } from "src/modules/auth/hooks";

interface Props extends RouteProps {}

const AuthGuard: React.FC<Props> = ({ ...rest }) => {
  const [isLoggedIn] = useComposeAuth(selectIsLoggedIn);
  return <Guard protect={!isLoggedIn} to="/login" {...rest} />;
};

export default observer(AuthGuard);
