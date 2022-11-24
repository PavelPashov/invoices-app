import {
  locationsReducer,
  locationsSlice,
} from "./../features/locations/locationsSlice";
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
import {
  tagsApi,
  tagsApiMiddleware,
  tagsApiReducer,
} from "../features/tags/tagsApi";
import { tagsSlice, tagsReducer } from "../features/tags/tagsSlice";
import {
  locationsApi,
  locationsApiMiddleware,
  locationsApiReducer,
} from "../features/locations/locationsApi";

const combinedReducer = combineReducers({
  [authSlice.name]: authReducer,
  [authApi.reducerPath]: authApiReducer,
  [numbersSlice.name]: numbersReducer,
  [numbersApi.reducerPath]: numbersApiReducer,
  [tagsSlice.name]: tagsReducer,
  [tagsApi.reducerPath]: tagsApiReducer,
  [locationsSlice.name]: locationsReducer,
  [locationsApi.reducerPath]: locationsApiReducer,
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
      .concat(numbersApiMiddleware)
      .concat(tagsApiMiddleware)
      .concat(locationsApiMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
