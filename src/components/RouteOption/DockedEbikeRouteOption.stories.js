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
      details: null,
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
        leaveAt: "2024-08-24T12:10",
        arriveAt: "2024-08-24T12:24",
        takeBikeAt: "2024-08-24T12:12",
        parkBikeAt: "2024-08-24T12:22",
        travelTimeTotal: "PT0H14M0S",
        walkingTimeFromStartingPoint: "PT0H1M0S",
        cyclingTimeStationToStation: "PT0H10M0S",
        walkingTimeToDestination: "PT0H3M0S",
        usualAvailabilityAtBikePickupStation: {
          standardBikes: 12,
          electricBikes: 17,
          emptyDocks: 3,
          totalDocks: 32,
        },
        usualAvailabilityAtBikeDropOffStation: {
          standardBikes: 19,
          electricBikes: 7,
          emptyDocks: 6,
          totalDocks: 32,
        },
      },
      loading: "succeeded",
      error: null,
    },
    isSelected: true,
  },
};

export const SelectedNoAvailabilityData = {
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
        ...Selected.args.routeOption.details,
        usualAvailabilityAtBikePickupStation: null,
        usualAvailabilityAtBikeDropOffStation: null,
      },
      loading: "succeeded",
      error: null,
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
      details: null,
    },
    isSelected: false,
    onClick: fn(),
    onStartingPointStationChange: fn(),
    onDestinationStationChange: fn(),
  },
};
