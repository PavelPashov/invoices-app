import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Routing } from '../../app/routing';
import { authSelector, logout } from '../../features/auth/authSlice';

export const Nav: React.FunctionComponent = () => {
  const { jwt } = useAppSelector(authSelector);

  const dispatch = useAppDispatch();

  const logoutUser = () => {
    dispatch(logout())
  }

  const className = jwt ? "flex flex-row" : "flex h-screen justify-center";

  const activeStyle = { background: "linear-gradient(90.01deg, #E4E4E4 0.01%, rgba(239, 239, 239, 0) 99.99%)" }

  return (
    <>
      <div className={className}>
        {jwt ? <div className="flex flex-col w-1/4  bg-[#F8F8F8] min-h-screen">
          <div className="flex flex-col w-auto text-sm p-2 mt-20 "></div>
          <NavLink to={'/'} style={({ isActive }) => (
            isActive ? activeStyle : {}
          )}>
            <div className="flex flex-col w-auto text-sm p-2">Фактури</div>
          </NavLink>
          <NavLink to={'/numbers'} style={({ isActive }) => (
            isActive ? activeStyle : {}
          )}>
            <div className="flex flex-col w-auto text-sm p-2" >Номера</div>
          </NavLink>
          <NavLink to={'/tags'} style={({ isActive }) => (
            isActive ? activeStyle : {}
          )}>
            <div className="flex flex-col w-auto text-sm p-2" >Групи</div>
          </NavLink>
          <button className="flex flex-col mt-auto text-sm p-2 mb-3" onClick={logoutUser}><span>Изход</span></button>
        </div> : ""}
        <Routing />
      </div>
    </>
  );
};