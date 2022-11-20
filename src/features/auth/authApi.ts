import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoginBody, LoginResponse } from "./type";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/v1/auth/login`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginBody>({
      query: ({ email, password }: LoginBody) => ({
        url: "",
        method: "POST",
        body: {
          email,
          password,
        },
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
export const authApiReducer = authApi.reducer;
export const authApiMiddleware = authApi.middleware;
