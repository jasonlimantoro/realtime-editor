import React from "react";
import { Formik, Form, Field } from "formik";
import { useMst } from "src/modules/root";

interface Props {}

const Register: React.FC<Props> = () => {
  const {
    auth: { register },
  } = useMst();
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

export default Register;
