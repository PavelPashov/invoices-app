import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";
import { INumber } from "./type";

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
    getNumbers: builder.query<INumber[], void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),
    updateNumber: builder.mutation({
      query: (values) => {
        const { id, ...body } = values;
        return {
          url: `/${id}`,
          method: "PATCH",
          body,
        };
      },
    }),
    createNumber: builder.mutation({
      query: (values) => {
        return {
          url: "",
          method: "POST",
          body: values,
        };
      },
    }),
    deleteNumber: builder.mutation({
      query: (values) => {
        const { id } = values;
        return {
          url: `/${id}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetNumbersQuery,
  useUpdateNumberMutation,
  useCreateNumberMutation,
  useDeleteNumberMutation,
} = numbersApi;
export const numbersApiReducer = numbersApi.reducer;
export const numbersApiMiddleware = numbersApi.middleware;
