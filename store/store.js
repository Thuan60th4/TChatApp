import { configureStore } from "@reduxjs/toolkit";
import ActionSlice from "./ActionSlice";

export const store = configureStore({
  reducer: ActionSlice,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
