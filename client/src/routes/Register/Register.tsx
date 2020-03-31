import React from "react";
import { connect } from "react-redux";
import { register } from "src/modules/auth/action";
import { Formik, Form, Field } from "formik";
import { AppState } from "src/modules/types";

interface RegisterProps {}

type Props = RegisterProps & LinkMapStateProps & LinkMapDispatchProps;

const Register: React.FC<Props> = ({ register }) => {
  return (
    <div>
      Register
      <Formik
        onSubmit={(values) => register(values.username, values.password)}
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

interface LinkMapStateProps {}

interface LinkMapDispatchProps {
  register: (username: string, password: string) => void;
}

const mapStateToProps = (state: AppState): LinkMapStateProps => ({});

const mapDispatchToProps: LinkMapDispatchProps = {
  register,
};

export default connect(mapStateToProps, mapDispatchToProps)(Register);
