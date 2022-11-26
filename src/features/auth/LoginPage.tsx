import { Formik } from 'formik';
import React, { useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { notify } from '../../common/utils/notification';
import { useLoginMutation } from './authApi';
import { authSelector } from './authSlice';
import { LoginForm } from './components/LoginForm';
import { LoginBody } from './type';
import { useNavigate } from "react-router-dom";

export const LoginPage: React.FunctionComponent = () => {

  const [login, { isSuccess, isError }] = useLoginMutation();

  const initialValues: LoginBody = {
    email: "",
    password: ""
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (isSuccess) {
      notify({ type: "success", message: "Успешно влизане" });
      navigate('/');
    }
    if (isError) notify({ type: "error", message: "Грешен имейл или парола" })
  }, [isSuccess, isError])

  const handleSubmit = async (values: LoginBody) => {
    try {
      await login(values);
    } catch (err) {
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