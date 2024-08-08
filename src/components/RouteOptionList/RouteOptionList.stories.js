import RouteOptionList from "./RouteOptionList";
import {fn} from "@storybook/test";

export default {
  title: "Components/RouteOptionList",
  component: RouteOptionList,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    routeOptionProps: [
      {
        type: "docked-ebike",
        provider: { name: "Some provider" },
        fromDockingStations: [
          { value: "foo", label: "Foo street, 123" },
          { value: "bar", label: "Bar street, 123" },
          { value: "baz", label: "Baz street, 123" },
        ],
        toDockingStations: [{ value: "qux", label: "Qux street, 123" }],
        onDockingStationChange: fn(),
      },
      {
        type: "docked-ebike",
        provider: { name: "Other provider" },
        fromDockingStations: [
          { value: "lorem", label: "Lorem street, 123" },
          { value: "ipsum", label: "Ipsum street, 123" },
          { value: "dolor", label: "Dolor street, 123" },
        ],
        toDockingStations: [{ value: "et", label: "Et street, 123" }],
        onDockingStationChange: fn(),
      }
    ],
    onRouteOptionSelected: fn(),
  },
};
