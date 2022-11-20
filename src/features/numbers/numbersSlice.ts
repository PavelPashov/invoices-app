import { NumberEntity } from "./type";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { numbersApi } from "./numbersApi";

const initialState: { numbers: NumberEntity[] | [] } = {
  numbers: [],
};

export const numbersSlice = createSlice({
  name: "numbers",
  initialState,
  reducers: {
    clear: (state: any) => {
      state.numbers = [];
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      numbersApi.endpoints.getNumbers.matchFulfilled,
      (state, { payload }) => {
        state.numbers = payload;
      }
    );
  },
});

export const { clear } = numbersSlice.actions;

export const numbersSelector = (state: RootState) => state.numbers;
export const numbersReducer = numbersSlice.reducer;
