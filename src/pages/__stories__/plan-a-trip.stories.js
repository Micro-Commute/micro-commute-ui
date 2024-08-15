import PlanATripPage from "../plan-a-trip";
import { LIST_ROUTE_OPTIONS_QUERY } from "../../modules/planatrip/graphql";
import { Provider } from "react-redux";
import React from "react";
import { store } from "../../modules/store";

export default {
  title: "Pages/PlanATrip",
  component: PlanATripPage,
};

export const Default = {
  args: {},
  decorators: [(story) => <Provider store={store}>{story()}</Provider>],
};

Default.parameters = {
  layout: "fullscreen",
  apolloClient: {
    mocks: [
      {
        request: {
          query: LIST_ROUTE_OPTIONS_QUERY,
        },
        variableMatcher: (variables) => true,
        maxUsageCount: Number.POSITIVE_INFINITY,
        delay: 500,
        result: {
          data: {
            listRouteOptions: [
              {
                __typename: "DockedEBikeRouteOption",
                provider: {
                  __typename: "Provider",
                  id: "tfl-santander-cycles",
                  name: "Santander Cycles",
                },
                fromDockingStations: [
                  {
                    __typename: "DockingStation",
                    id: "300249",
                    name: "Westminster Pier, Westminster",
                    location: {
                      __typename: "Coordinates",
                      longitude: -0.12382322,
                      latitude: 51.501513,
                    },
                  },
                  {
                    __typename: "DockingStation",
                    id: "200231",
                    name: "Abingdon Green, Westminster",
                    location: {
                      __typename: "Coordinates",
                      longitude: -0.12597218,
                      latitude: 51.49764,
                    },
                  },
                  {
                    __typename: "DockingStation",
                    id: "200202",
                    name: "Storey's Gate, Westminster",
                    location: {
                      __typename: "Coordinates",
                      longitude: -0.129698963,
                      latitude: 51.50070305,
                    },
                  },
                ],
                toDockingStations: [
                  {
                    __typename: "DockingStation",
                    id: "001071",
                    name: "Tower Gardens , Tower",
                    location: {
                      __typename: "Coordinates",
                      longitude: -0.075459482,
                      latitude: 51.50950627,
                    },
                  },
                  {
                    __typename: "DockingStation",
                    id: "000991",
                    name: "Crosswall, Tower",
                    location: {
                      __typename: "Coordinates",
                      longitude: -0.077121322,
                      latitude: 51.51159481,
                    },
                  },
                  {
                    __typename: "DockingStation",
                    id: "200049",
                    name: "St. Katharine's Way, Tower",
                    location: {
                      __typename: "Coordinates",
                      longitude: -0.070542,
                      latitude: 51.505697,
                    },
                  },
                ],
              },
            ],
          },
        },
      },
    ],
  },
};
