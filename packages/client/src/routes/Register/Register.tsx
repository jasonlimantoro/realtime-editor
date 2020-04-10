import React from "react";
import { Formik, Form, Field } from "formik";
import { useMst } from "src/modules/root";
import { observer } from "mobx-react";
import { Link } from "react-router-dom";

interface Props {}

const Register: React.FC<Props> = () => {
  const {
    auth: { register, registerError, registerSuccess },
  } = useMst();
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
