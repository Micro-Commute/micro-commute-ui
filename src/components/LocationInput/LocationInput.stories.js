import React from "react";
import LocationInput from "./LocationInput";
import { fn } from "@storybook/test";

export default {
  title: "Components/LocationInput",
  component: LocationInput,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    onLocationChange: fn(),
  },
};
