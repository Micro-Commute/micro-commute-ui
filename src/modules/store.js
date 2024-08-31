import { configureStore } from "@reduxjs/toolkit";
import planATripSlice from "./planatrip/planATripSlice";

export function initStore() {
  return configureStore({
    reducer: {
      planATrip: planATripSlice,
    },
  });
}

export const store = initStore();
