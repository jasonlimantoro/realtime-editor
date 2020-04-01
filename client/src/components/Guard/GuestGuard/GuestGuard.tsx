import React from "react";
import { connect } from "react-redux";
import { selectIsLoggedIn } from "src/modules/auth/selector";
import Guard from "src/components/Guard/Guard";
import { AppState } from "src/modules/types";
import { RouteProps } from "react-router-dom";

interface AuthGuardProps extends RouteProps {}

type Props = AuthGuardProps & LinkMapStateProps & LinkMapStateProps;

const AuthGuard: React.FC<Props> = ({ isLoggedIn, ...rest }) => {
  return <Guard protect={isLoggedIn} to="/editors" {...rest} />;
};

interface LinkMapStateProps {
  isLoggedIn: boolean;
}

interface LinkMapDispatchProps {}

const mapDispatchToProps: LinkMapDispatchProps = () => ({});

const mapStateToProps = (state: AppState): LinkMapStateProps => ({
  isLoggedIn: selectIsLoggedIn(state),
});

export default connect(mapStateToProps, mapDispatchToProps)(AuthGuard);
