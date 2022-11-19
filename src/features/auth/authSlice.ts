import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { authApi } from "./authApi";

const initialState: { jwt: string | null } = {
  jwt: localStorage.getItem("jwt") || null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state: any) => {
      localStorage.clear();
      state.jwt = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        const { token } = payload;
        localStorage.setItem("jwt", token);
        state.jwt = token;
      }
    );
  },
});

export const { logout } = authSlice.actions;

export const authSelector = (state: RootState) => state.authSlice;
