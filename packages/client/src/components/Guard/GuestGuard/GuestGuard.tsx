import React from "react";
import { Guard } from "react-common-util";
import { RouteProps } from "react-router-dom";
import { observer } from "mobx-react";
import { selectIsLoggedIn, useComposeAuth } from "src/modules/auth/hooks";

interface Props extends RouteProps {}

const GuestGuard: React.FC<Props> = ({ ...rest }) => {
  const [isLoggedIn] = useComposeAuth(selectIsLoggedIn);
  return <Guard protect={isLoggedIn} to="/editors" {...rest} />;
};

export default observer(GuestGuard);
