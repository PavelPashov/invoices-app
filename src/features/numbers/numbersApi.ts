import {
  createApi,
  FetchArgs,
  fetchBaseQuery,
  retry,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";
import { INumber } from "./type";

const retryBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/v1/phone`,
    prepareHeaders: (headers: Headers, { getState }) => {
      const token = (getState() as RootState).auth.jwt;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  {
    maxRetries: 5,
  }
);

export const numbersApi = createApi({
  reducerPath: "numbersApi",
  refetchOnMountOrArgChange: true,
  baseQuery: retryBaseQuery,
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
      extraOptions: { maxRetries: 0 },
    }),
    createNumber: builder.mutation({
      query: (values) => {
        return {
          url: "",
          method: "POST",
          body: values,
        };
      },
      extraOptions: { maxRetries: 0 },
    }),
    deleteNumber: builder.mutation({
      query: (values) => {
        const { id } = values;
        return {
          url: `/${id}`,
          method: "DELETE",
        };
      },
      extraOptions: { maxRetries: 0 },
    }),
    uploadFile: builder.mutation<File, FormData>({
      query: (body) => {
        return {
          method: "POST",
          url: "/invoice",
          body,
        };
      },
      extraOptions: { maxRetries: 0 },
    }),
  }),
});

export const {
  useGetNumbersQuery,
  useUpdateNumberMutation,
  useCreateNumberMutation,
  useDeleteNumberMutation,
  useUploadFileMutation,
} = numbersApi;
export const numbersApiReducer = numbersApi.reducer;
export const numbersApiMiddleware = numbersApi.middleware;
