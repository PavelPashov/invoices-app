import { configureStore } from "@reduxjs/toolkit";
import { authSlice, logout } from "../features/auth/authSlice";

export const store = configureStore({
  reducer: {
    authSlice: authSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
