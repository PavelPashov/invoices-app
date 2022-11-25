import { ILocation } from "./types";
import { createApi, fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../app/store";

const retryBaseQuery = retry(
  fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/v1/location`,
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

export const locationsApi = createApi({
  reducerPath: "locationsApi",
  baseQuery: retryBaseQuery,
  endpoints: (builder) => ({
    getLocations: builder.query<ILocation[], void>({
      query: () => ({
        url: "",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetLocationsQuery } = locationsApi;
export const locationsApiReducer = locationsApi.reducer;
export const locationsApiMiddleware = locationsApi.middleware;
