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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Mini Google Docs
          </h2>
        </div>
        <Formik
          initialValues={{ username: "", password: "" }}
          onSubmit={(values) => register(values.username, values.password)}
        >
          <Form className="mt-8 space-y-6">
            {registerError && (
              <p className="text-red-500">Register error: {registerError}</p>
            )}
            {registerSuccess && (
              <p className="text-green-600">Registration success</p>
            )}
            <div className="rounded-md shadow-sm -space-y-px mb-4">
              <div>
                <label htmlFor="username" className="sr-only">
                  username
                </label>
                <Field
                  id="username"
                  name="username"
                  type="username"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="mb-4">
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                Register
              </button>
            </div>
            <div className="text-center">
              <p className="text-gray-600">Already have an account?</p>
              <Link
                to="/login"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign in
              </Link>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default observer(Register);
