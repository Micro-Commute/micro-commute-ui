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
      travelTimes: {
        departureTime: "8:31 am",
        arrivalTime: "8:45 am",
        takeBikeTime: "8:32 am",
        parkBikeTime: "8:42 am",
        totalTravelTime: "14 min",
        walkingToDockingStation: "1 min",
        bikingTime: "10 min",
        walkingToDestination: "3 min",
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
      travelTimes: {
        departureTime: "8:31 am",
        arrivalTime: "8:45 am",
        takeBikeTime: "8:32 am",
        parkBikeTime: "8:42 am",
        totalTravelTime: "14 min",
        walkingToDockingStation: "1 min",
        bikingTime: "10 min",
        walkingToDestination: "3 min",
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
      travelTimes: {
        departureTime: "",
        arrivalTime: "",
        takeBikeTime: "",
        parkBikeTime: "",
        totalTravelTime: "",
        walkingToDockingStation: "",
        bikingTime: "",
        walkingToDestination: "",
      },
    },
    isSelected: false,
    onClick: fn(),
    onStartingPointStationChange: fn(),
    onDestinationStationChange: fn(),
  },
};
