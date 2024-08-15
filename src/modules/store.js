import { configureStore } from "@reduxjs/toolkit";
import planATripSlice from "./planatrip/planATripSlice";

export const store = configureStore({
  reducer: {
    planATrip: planATripSlice,
  },
});
