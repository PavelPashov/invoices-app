import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";
import { ITag } from "./type";

const retryBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/v1/tag`,
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

export const tagsApi = createApi({
  reducerPath: "tagsApi",
  refetchOnMountOrArgChange: true,
  baseQuery: retryBaseQuery,
  endpoints: (builder) => ({
    getTags: builder.query<ITag[], void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),
    updateTag: builder.mutation({
      query: (values) => {
        const { id, numbers, ...body } = values;
        return {
          url: `/${id}`,
          method: "PATCH",
          body,
        };
      },
      extraOptions: { maxRetries: 0 },
    }),
    createTag: builder.mutation({
      query: (values) => {
        return {
          url: "",
          method: "POST",
          body: values,
        };
      },
      extraOptions: { maxRetries: 0 },
    }),
    deleteTag: builder.mutation({
      query: (values) => {
        const { id } = values;
        return {
          url: `/${id}`,
          method: "DELETE",
        };
      },
      extraOptions: { maxRetries: 0 },
    }),
  }),
});

export const {
  useGetTagsQuery,
  useUpdateTagMutation,
  useCreateTagMutation,
  useDeleteTagMutation,
} = tagsApi;
export const tagsApiReducer = tagsApi.reducer;
export const tagsApiMiddleware = tagsApi.middleware;
