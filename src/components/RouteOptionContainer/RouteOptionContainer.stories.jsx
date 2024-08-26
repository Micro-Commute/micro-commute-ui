import React from "react";
import { Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import RouteOptionsContainer from "./RouteOptionContainer";
import { planATripSlice } from "../../modules/planatrip/planATripSlice";

const MockedState = {
  providers: {
    provider111: {
      id: "provider111",
      name: "Some provider",
    },
    provider222: {
      id: "provider222",
      name: "Other provider",
    },
  },
  routeOptions: {
    entities: [
      {
        providerId: "provider111",
        transportType: "docked-ebike",
        nearByStations: {
          startingPoint: [
            { id: "foo", name: "Foo street, 123" },
            { id: "bar", name: "Bar street, 123" },
          ],
          destination: [
            { id: "baz", name: "Baz street, 123" },
            { id: "qux", name: "Qux street, 123" },
          ],
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
        },
      },
      {
        providerId: "provider222",
        transportType: "docked-ebike",
        nearByStations: {
          startingPoint: [
            { id: "lorem", name: "Lorem street, 123" },
            { id: "ipsum", name: "Ipsum street, 123" },
          ],
          destination: [
            { id: "dolor", name: "Dolor street, 123" },
            { id: "et", name: "Et street, 123" },
          ],
        },
        selectedStationIds: {
          startingPoint: "ipsum",
          destination: "dolor",
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
        },
      },
    ],
    selectedEntityIndex: 0,
  },
};

const Mockstore = ({ children }) => (
  <Provider
    store={configureStore({
      reducer: {
        planATrip: createSlice({
          name: "planATrip",
          initialState: MockedState,
          reducers: planATripSlice.caseReducers,
        }).reducer,
      },
    })}
  >
    {children}
  </Provider>
);

export default {
  title: "Components/RouteOptionContainer",
  component: RouteOptionsContainer,
  tags: ["autodocs"],
};

export const Default = {
  decorators: [(story) => <Mockstore>{story()}</Mockstore>],
};
