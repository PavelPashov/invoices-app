import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";
import { ITag } from "./type";

export const tagsApi = createApi({
  reducerPath: "tagsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/v1/tag`,
    prepareHeaders: (headers: Headers, { getState }) => {
      const token = (getState() as RootState).auth.jwt;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getTags: builder.query<ITag[], void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetTagsQuery } = tagsApi;
export const tagsApiReducer = tagsApi.reducer;
export const tagsApiMiddleware = tagsApi.middleware;
