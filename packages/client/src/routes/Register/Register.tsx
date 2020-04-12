import React from "react";
import { Formik, Form, Field } from "formik";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";
import { selectRegisterData, useComposeAuth } from "src/modules/auth/hooks";

interface Props {}

const Register: React.FC<Props> = () => {
  const [{ register, registerError, registerSuccess }] = useComposeAuth(
    selectRegisterData
  );
  return (
    <div>
      {registerError && (
        <p className="text-red-500">Register error: {registerError}</p>
      )}
      {registerSuccess && (
        <p className="text-green-600">Registration success</p>
      )}
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
      <Link className="underline" to="/login">
        Login
      </Link>
    </div>
  );
};

export default observer(Register);
