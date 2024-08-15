import React from "react";
import { Provider } from "react-redux";
import { store } from "../store";

export function wrapWithReduxProvider(element) {
  return <Provider store={store}>{element}</Provider>;
}
