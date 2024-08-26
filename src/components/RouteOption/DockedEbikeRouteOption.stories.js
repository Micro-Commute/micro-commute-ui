import { fn } from "@storybook/test";
import { TransportType } from "../../modules/types";
import React from "react";
import DockedEbikeRouteOption from "./DockedEbikeRouteOption";

export default {
  title: "Components/RouteOption/DockedEbike",
  component: DockedEbikeRouteOption,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    routeOption: {
      provider: {
        id: "some-provider",
        name: "Some provider",
      },
      transportType: TransportType.DOCKED_EBIKE,
      nearByStations: {
        startingPoint: [
          { id: "foo", name: "Foo street, 123" },
          { id: "bar", name: "Bar street, 123" },
          { id: "baz", name: "Baz street, 123" },
        ],
        destination: [{ id: "qux", name: "Qux street, 123" }],
      },
      selectedStationIds: {
        startingPoint: "foo",
        destination: "qux",
      },
      details: {
        leaveAt: "DateTime",
        arriveAt: "DateTime",
        takeBikeAt: "DateTime",
        parkBikeAt: "DateTime",
        travelTimeTotal: "Duration",
        walkingTimeFromStartingPoint: "Duration",
        cyclingTimeStationToStation: "Duration",
        walkingTimeToDestination: "Duration",
      },
    },
    isSelected: false,
    onClick: fn(),
    onStartingPointStationChange: fn(),
    onDestinationStationChange: fn(),
  },
};

export const Selected = {
  args: {
    routeOption: {
      provider: {
        id: "some-provider",
        name: "Some provider",
      },
      transportType: TransportType.DOCKED_EBIKE,
      nearByStations: {
        startingPoint: [
          { id: "foo", name: "Foo street, 123" },
          { id: "bar", name: "Bar street, 123" },
          { id: "baz", name: "Baz street, 123" },
        ],
        destination: [{ id: "qux", name: "Qux street, 123" }],
      },
      selectedStationIds: {
        startingPoint: "foo",
        destination: "qux",
      },
      details: {
        leaveAt: "DateTime",
        arriveAt: "DateTime",
        takeBikeAt: "DateTime",
        parkBikeAt: "DateTime",
        travelTimeTotal: "Duration",
        walkingTimeFromStartingPoint: "Duration",
        cyclingTimeStationToStation: "Duration",
        walkingTimeToDestination: "Duration",
      },
    },
    isSelected: true,
  },
};

export const Empty = {
  args: {
    routeOption: {
      provider: {
        id: "some-provider",
        name: "Some provider",
      },
      transportType: TransportType.DOCKED_EBIKE,
      nearByStations: {
        startingPoint: [],
        destination: [],
      },
      selectedStationIds: {
        startingPoint: null,
        destination: null,
      },
      details: {
        leaveAt: "",
        arriveAt: "",
        takeBikeAt: "",
        parkBikeAt: "",
        travelTimeTotal: "",
        walkingTimeFromStartingPoint: "",
        cyclingTimeStationToStation: "",
        walkingTimeToDestination: "",
      },
    },
    isSelected: false,
    onClick: fn(),
    onStartingPointStationChange: fn(),
    onDestinationStationChange: fn(),
  },
};
