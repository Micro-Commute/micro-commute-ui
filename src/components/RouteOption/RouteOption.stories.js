import RouteOption from "./RouteOption";
import { fn } from "@storybook/test";
import { TransportType } from "../../lib/types";

export default {
  title: "Components/RouteOption",
  component: RouteOption,
  tags: ["autodocs"],
};

export const DockedEbike = {
  args: {
    routeOption: {
      provider: {
        id: "some-provider",
        name: "Some provider",
      },
      transportType: TransportType.DOCKED_EBIKE,
      extraProperties: {
        fromDockingStations: [
          { id: "foo", name: "Foo street, 123" },
          { id: "bar", name: "Bar street, 123" },
          { id: "baz", name: "Baz street, 123" },
        ],
        toDockingStations: [{ id: "qux", name: "Qux street, 123" }],
      },
    },
    isSelected: false,
    select: fn(),
  },
};

export const DockedEbikeEmpty = {
  args: {
    routeOption: {
      provider: {
        id: "some-provider",
        name: "Some provider",
      },
      transportType: TransportType.DOCKED_EBIKE,
      extraProperties: {
        fromDockingStations: [],
        toDockingStations: [],
      },
    },
    isSelected: false,
    select: fn(),
  },
};

export const DockedEbikeSelected = {
  args: {
    routeOption: {
      provider: {
        id: "some-provider",
        name: "Some provider",
      },
      transportType: TransportType.DOCKED_EBIKE,
      extraProperties: {
        fromDockingStations: [
          { id: "foo", name: "Foo street, 123" },
          { id: "bar", name: "Bar street, 123" },
          { id: "baz", name: "Baz street, 123" },
        ],
        toDockingStations: [{ id: "qux", name: "Qux street, 123" }],
      },
    },
    isSelected: true,
    select: fn(),
  },
};
