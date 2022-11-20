import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";
import { NumberEntity } from "./type";

export const numbersApi = createApi({
  reducerPath: "numbersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/v1/phone`,
    prepareHeaders: (headers: Headers, { getState }) => {
      const token = (getState() as RootState).auth.jwt;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getNumbers: builder.query<NumberEntity[], void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetNumbersQuery } = numbersApi;
export const numbersApiReducer = numbersApi.reducer;
export const numbersApiMiddleware = numbersApi.middleware;
