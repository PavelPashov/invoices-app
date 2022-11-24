import { ILocation } from "./types";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { locationsApi } from "./locationsApi";

const initialState: { locations: ILocation[] | [] } = {
  locations: [],
};

export const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    clear: (state: any) => {
      state.locations = [];
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      locationsApi.endpoints.getLocations.matchFulfilled,
      (state, { payload }) => {
        console.log("TEST: ", payload);
        state.locations = payload;
      }
    );
  },
});

export const { clear } = locationsSlice.actions;

export const locationsSelector = (state: RootState) => state.locations;
export const locationsReducer = locationsSlice.reducer;
