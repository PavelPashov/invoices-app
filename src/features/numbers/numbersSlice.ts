import { INumber } from "./type";
import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { numbersApi } from "./numbersApi";

const initialState: { numbers: INumber[] | [] } = {
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
    builder.addMatcher(
      numbersApi.endpoints.updateNumber.matchFulfilled,
      (state, { payload }) => {
        const { id } = payload;
        state.numbers = state.numbers.map((num) => {
          if (num.id !== id) return num;
          return payload;
        });
      }
    );
    builder.addMatcher(
      numbersApi.endpoints.createNumber.matchFulfilled,
      (state, { payload }) => {
        const { numbers, ...restNumber } = payload;
        state.numbers = [...state.numbers, restNumber];
      }
    );
    builder.addMatcher(
      numbersApi.endpoints.deleteNumber.matchFulfilled,
      (state, { payload }) => {
        const { id } = payload;
        state.numbers = state.numbers.filter((num) => num.id !== id);
      }
    );
  },
});

export const { clear } = numbersSlice.actions;

export const numbersSelector = (state: RootState) => state.numbers;
export const numbersReducer = numbersSlice.reducer;
