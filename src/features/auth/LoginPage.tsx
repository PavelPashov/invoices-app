import { Formik } from 'formik';
import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { notify } from '../../common/utils/utils';
import { useLoginMutation } from './authApi';
import { authSelector } from './authSlice';
import { LoginForm } from './components/LoginForm';
import { LoginBody } from './type';
import { useNavigate } from "react-router-dom";

export const LoginPage: React.FunctionComponent = () => {

  const [login, { isLoading, isError, reset }] = useLoginMutation();

  const initialValues: LoginBody = {
    email: "",
    password: ""
  };


  const navigate = useNavigate();


  const handleSubmit = async (values: LoginBody) => {
    try {
      const resp = await login(values);
      if ('data' in resp) {
        notify({ type: "success", message: "Влязохте успешно" })
        navigate('/numbers');
        // window.location.replace("/numbers")
      }
      if ('error' in resp) {
        notify({ type: "error", message: "Грешен имейл или парола" })
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