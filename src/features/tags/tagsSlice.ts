import { ITag } from "./type";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { tagsApi } from "./tagsApi";

const initialState: { tags: ITag[] | [] } = {
  tags: [],
};

export const tagsSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {
    clear: (state: any) => {
      state.tags = [];
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      tagsApi.endpoints.getTags.matchFulfilled,
      (state, { payload }) => {
        state.tags = payload;
      }
    );
  },
});

export const { clear } = tagsSlice.actions;

export const tagsSelector = (state: RootState) => state.tags;
export const tagsReducer = tagsSlice.reducer;
