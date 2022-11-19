import React from 'react';

interface ButtonProps {
  title: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset" | undefined;
}

export const Button: React.FunctionComponent<ButtonProps> = ({
  title,
  type,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={'text-white bg-[#7795FF] border-2 rounded-2xl w-1/2 py-2 my-2 text-base'}
    >
      <span className='align-middle text-lg'>{title}</span>
    </button >
  );
};