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
      { id: "foo", name: "Foo street, 123" },
      { id: "bar", name: "Bar street, 123" },
      { id: "baz", name: "Baz street, 123" },
    ],
    toDockingStations: [{ id: "qux", name: "Qux street, 123" }],
    onFromDockingStationSelect: fn(),
    onToDockingStationSelect: fn(),
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
    onFromDockingStationSelect: fn(),
    onToDockingStationSelect: fn(),
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
      { id: "foo", name: "Foo street, 123" },
      { id: "bar", name: "Bar street, 123" },
      { id: "baz", name: "Baz street, 123" },
    ],
    toDockingStations: [{ id: "qux", name: "Qux street, 123" }],
    onFromDockingStationSelect: fn(),
    onToDockingStationSelect: fn(),
    isSelected: true,
    onClick: fn(),
  },
};
