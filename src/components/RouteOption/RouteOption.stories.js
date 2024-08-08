import RouteOption from "./RouteOption";
import { fn } from "@storybook/test";

export default {
  title: "Components/RouteOption",
  component: RouteOption,
  tags: ["autodocs"],
};

export const DockedEbike = {
  args: {
    type: "docked-ebike",
    provider: {
      id: "some-provider",
      name: "Some provider",
    },
    fromDockingStations: [
      { value: "foo", label: "Foo street, 123" },
      { value: "bar", label: "Bar street, 123" },
      { value: "baz", label: "Baz street, 123" },
    ],
    toDockingStations: [{ value: "qux", label: "Qux street, 123" }],
    onDockingStationChange: fn(),
    isSelected: false,
    onClick: fn(),
  },
};

export const DockedEbikeEmpty = {
  args: {
    type: "docked-ebike",
    provider: {
      id: "some-provider",
      name: "Some provider",
    },
    fromDockingStations: [],
    toDockingStations: [],
    onDockingStationChange: fn(),
    isSelected: false,
    onClick: fn(),
  },
};

export const DockedEbikeSelected = {
  args: {
    type: "docked-ebike",
    provider: {
      id: "some-provider",
      name: "Some provider",
    },
    fromDockingStations: [
      { value: "foo", label: "Foo street, 123" },
      { value: "bar", label: "Bar street, 123" },
      { value: "baz", label: "Baz street, 123" },
    ],
    toDockingStations: [{ value: "qux", label: "Qux street, 123" }],
    onDockingStationChange: fn(),
    isSelected: true,
    onClick: fn(),
  },
};
