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
    builder.addMatcher(
      tagsApi.endpoints.updateTag.matchFulfilled,
      (state, { payload }) => {
        const { id } = payload;
        state.tags = state.tags.map((tag) => {
          if (tag.id !== id) return tag;
          return payload;
        });
      }
    );
    builder.addMatcher(
      tagsApi.endpoints.createTag.matchFulfilled,
      (state, { payload }) => {
        const { numbers, ...restTag } = payload;
        state.tags = [...state.tags, restTag];
      }
    );
    builder.addMatcher(
      tagsApi.endpoints.deleteTag.matchFulfilled,
      (state, { payload }) => {
        const { id } = payload;
        state.tags = state.tags.filter((tag) => tag.id !== id);
      }
    );
  },
});

export const { clear } = tagsSlice.actions;

export const tagsSelector = (state: RootState) => state.tags;
export const tagsReducer = tagsSlice.reducer;
