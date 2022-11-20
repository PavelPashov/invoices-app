import {
  numbersReducer,
  numbersSlice,
} from "./../features/numbers/numbersSlice";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authReducer, authSlice } from "../features/auth/authSlice";
import {
  authApi,
  authApiMiddleware,
  authApiReducer,
} from "../features/auth/authApi";
import {
  numbersApi,
  numbersApiMiddleware,
  numbersApiReducer,
} from "../features/numbers/numbersApi";

const combinedReducer = combineReducers({
  [authSlice.name]: authReducer,
  [authApi.reducerPath]: authApiReducer,
  [numbersSlice.name]: numbersReducer,
  [numbersApi.reducerPath]: numbersApiReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/resetAuth") {
    state = undefined;
  }
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(authApiMiddleware)
      .concat(numbersApiMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
