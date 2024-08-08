// import RouteOption from "./RouteOption";
// import { fn } from "@storybook/test";

// export default {
//   title: "Components/RouteOption",
//   component: RouteOption,
//   tags: ["autodocs"],
// };

// export const DockedEbike = {
//   args: {
//     type: "docked-ebike",
//     provider: { name: "Some provider" },
//     fromDockingStations: [
//       { value: "foo", label: "Foo street, 123" },
//       { value: "bar", label: "Bar street, 123" },
//       { value: "baz", label: "Baz street, 123" },
//     ],
//     toDockingStations: [{ value: "qux", label: "Qux street, 123" }],
//     onDockingStationChange: fn(),
//   },
// };

// export const DockedEbikeEmpty = {
//   args: {
//     type: "docked-ebike",
//     provider: { name: "Some provider" },
//     fromDockingStations: [],
//     toDockingStations: [],
//     onDockingStationChange: fn(),
//   },
// };


import React from "react";
import RouteOption from "./RouteOption";
import { fn } from "@storybook/test";

export default {
  title: "Components/RouteOption",
  component: RouteOption,
  tags: ["autodocs"],
};

export const Selected = {
  args: {
    type: "docked-ebike",
    provider: { name: "Selected provider" },
    fromDockingStations: [
      { value: "selectedFoo", label: "Selected Foo street, 123" },
    ],
    toDockingStations: [{ value: "selectedQux", label: "Selected Qux street, 123" }],
    onDockingStationChange: fn(),
    isSelected: true,
  },
};
