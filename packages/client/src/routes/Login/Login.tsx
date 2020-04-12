import React from "react";
import { Formik, Form, Field } from "formik";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { selectLoginData, useComposeAuth } from "src/modules/auth/hooks";

interface Props {}

const Login: React.FC<Props> = () => {
  const [{ login, logoutReason, loginError }] = useComposeAuth(selectLoginData);
  return (
    <div>
      {logoutReason && <p className="text-red-500">Reason: {logoutReason}</p>}
      {loginError && <p className="text-red-500">Login error: {loginError}</p>}
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
      <Link className="underline" to="/register">
        Register
      </Link>
    </div>
  );
};

export default observer(Login);
