import React from "react";
import { Guard } from "rc-common";
import { RouteProps } from "react-router-dom";
import { useMst } from "src/modules/root";
import { observer } from "mobx-react";

interface Props extends RouteProps {}

const AuthGuard: React.FC<Props> = ({ ...rest }) => {
  const {
    auth: { isLoggedIn },
  } = useMst();
  return <Guard protect={!isLoggedIn} to="/login" {...rest} />;
};

export default observer(AuthGuard);
