import { Formik } from 'formik';
import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { useLoginMutation } from './authApi';
import { authSelector } from './authSlice';
import { LoginForm } from './components/LoginForm';
import { LoginBody } from './type';


export const LoginPage: React.FunctionComponent = () => {

  const [login, { isLoading, isError, reset }] = useLoginMutation();

  const initialValues: LoginBody = {
    email: "",
    password: ""
  };

  const handleSubmit = async (values: LoginBody) => {
    try {
      const resp = await login(values);
      if ('data' in resp) {
        window.location.replace("/numbers")
      }
    } catch (err) {
      console.log("err");
      console.log(err);
    }
  };

  const { jwt } = useAppSelector(authSelector);

  return (
    <>
      {
        jwt ? "" :
          <div className="min-h-[80vh] flex flex-col justify-center px-10">
            <h1 className="text-[#505050] font-medium font-sans text-2xl mb-6">Вход</h1>
            <Formik
              initialValues={initialValues}
              onSubmit={handleSubmit}
            >
              {({
                values,
                handleSubmit,
                handleChange, }) => {
                return <LoginForm
                  handleSubmit={handleSubmit}
                  values={values}
                  handleChange={handleChange}
                />;
              }
              }
            </Formik>
          </div>
      }

    </>
  )
}