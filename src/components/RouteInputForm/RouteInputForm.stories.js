import React from "react";
import RouteInputForm from "./RouteInputForm";
import { fn } from "@storybook/test";

export default {
  title: "Components/RouteInputForm",
  component: RouteInputForm,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    onStartingPointChange: fn(),
    onDestinationChange: fn(),
    onArriveByDateTimeChange: fn(),
    arriveByValue: "2023-09-10T10:00",
  },
};
