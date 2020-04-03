import React from "react";
import { connect } from "react-redux";
import { login } from "src/modules/auth/action";
import { Formik, Form, Field } from "formik";
import { AppState } from "src/modules/types";
import { selectLogoutReason } from "src/modules/auth/selector";

interface LoginProps {}

type Props = LoginProps & LinkMapStateProps & LinkMapDispatchProps;

const Login: React.FC<Props> = ({ login, logoutReason }) => {
  return (
    <div>
      {logoutReason && <p className="text-red-500">Reason: {logoutReason}</p>}
      Login
      <Formik
        onSubmit={(values) => login(values.username, values.password)}
        initialValues={{ username: "", password: "" }}
      >
        <Form className="p-4" autoComplete="off">
          <div>
            <Field placeholder="Enter username" name="username" />
          </div>
          <div>
            <Field
              placeholder="Enter password"
              name="password"
              type="password"
            />
          </div>
          <button className="btn btn-gray" type="submit">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  );
};

interface LinkMapStateProps {
  logoutReason: string;
}

interface LinkMapDispatchProps {
  login: (username: string, password: string) => void;
}

const mapStateToProps = (state: AppState): LinkMapStateProps => ({
  logoutReason: selectLogoutReason(state),
});

const mapDispatchToProps: LinkMapDispatchProps = {
  login,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
