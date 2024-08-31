import RouteMap from "./RouteMap";
import { Provider } from "react-redux";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { planATripSlice } from "../../modules/planatrip/planATripSlice";
import React from "react";

const MockedState = {
  startingPoint: {
    address: "Travessera de Gràcia, 250, Gràcia, 08025 Barcelona",
    coordinates: {
      latitude: 41.40545511337635,
      longitude: 2.1646206668742907,
    },
  },
  destination: {
    address: "C/ de Lepant, 150, L'Eixample, 08013 Barcelona",
    coordinates: {
      latitude: 41.39870052376385,
      longitude: 2.185473748057414,
    },
  },
  providers: {
    bicing: {
      id: "bicing",
      name: "Bicing",
    },
  },
  routeOptions: {
    entities: [
      {
        providerId: "provider111",
        transportType: "docked-ebike",
        nearByStations: {
          startingPoint: [
            {
              id: "napols-344",
              name: "C/ NÀPOLS, 344, 08025 Barcelona",
              coordinates: {
                latitude: 41.40566350628676,
                longitude: 2.1672752237756345,
              },
            },
            {
              id: "bruniquer-59",
              name: "PL JOANIC - C / BRUNIQUER, 59, 08024 Barcelona",
              coordinates: {
                latitude: 41.40579968226994,
                longitude: 2.1629807271681214,
              },
            },
            {
              id: "montmany-1",
              name: "C/ MONTMANY, 1, 08012 Barcelona",
              coordinates: {
                latitude: 41.40385942548947,
                longitude: 2.161635159487782,
              },
            },
          ],
          destination: [
            {
              id: "ribes-59",
              name: "C/ DE RIBES, 59 B, 08013 Barcelona",
              coordinates: {
                latitude: 41.39837512575936,
                longitude: 2.183411953885501,
              },
            },
            {
              id: "ribes-77",
              name: "C/ RIBES, 77, 08013 Barcelona",
              coordinates: {
                latitude: 41.400253829651625,
                longitude: 2.184512346167795,
              },
            },
            {
              id: "meridiana-47",
              name: "AV. MERIDIANA, 47 (D), 08013 Barcelona",
              coordinates: {
                latitude: 41.398385395336454,
                longitude: 2.187036829322798,
              },
            },
          ],
        },
        selectedStationIds: {
          startingPoint: "napols-344",
          destination: "ribes-59",
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
  title: "Components/RouteMap",
  component: RouteMap,
  tags: ["autodocs"],
};

export const Default = {
  decorators: [(story) => <Mockstore>{story()}</Mockstore>],
};
