import React, { ChangeEventHandler, FormEventHandler } from 'react';
import { Button } from '../../../common/components/Button/Button';
import { LoginBody } from '../type';

interface LoginFormProps {
  handleSubmit: FormEventHandler<HTMLFormElement>;
  handleChange: ChangeEventHandler;
  values: LoginBody;
}

export const LoginForm: React.FunctionComponent<LoginFormProps> = ({ handleSubmit, values, handleChange }) => {

  return (
    <>
      <form onSubmit={handleSubmit} className=" flex flex-col">
        <input placeholder="Имейл" type={"email"} name="email" value={values.email} onChange={handleChange} className="border-b-2 mb-12"></input>
        <input placeholder="Парола" type={"password"} name="password" value={values.password} onChange={handleChange} className="border-b-2 mb-12"></input>
        <div className="flex justify-end">
          <Button title="Вход" type="submit" />
        </div>
      </form>
    </>
  )
}