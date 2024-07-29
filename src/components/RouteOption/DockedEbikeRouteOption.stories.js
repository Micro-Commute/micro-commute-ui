import DockedEbikeRouteOption from "./DockedEbikeRouteOption";
import { fn } from "@storybook/test";

export default {
  title: "Components/RouteOption",
  component: DockedEbikeRouteOption,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    provider: { name: "Some provider" },
    fromDockingStations: [
      { value: "foo", label: "Foo street, 123" },
      { value: "bar", label: "Bar street, 123" },
      { value: "baz", label: "Baz street, 123" },
    ],
    toDockingStations: [{ value: "qux", label: "Qux street, 123" }],
    onDockingStationChange: fn(),
  },
};

export const Empty = {
  args: {
    provider: { name: "Some provider" },
    fromDockingStations: [],
    toDockingStations: [],
    onDockingStationChange: fn(),
  },
};
