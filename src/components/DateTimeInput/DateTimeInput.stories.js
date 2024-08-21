import React from "react";
import DateTimeInput from "./DateTimeInput";
import { fn } from "@storybook/test";

export default {
  title: "Components/DateTimeInput",
  component: DateTimeInput,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    value: "2023-09-10T10:00", // Example date and time
    onChange: fn(),
  },
};
