import React from "react";
import RouteOptionList from "./RouteOptionList";
import { TransportType } from "../../lib/types";
import { useState } from "react";

export default {
  title: "Components/RouteOptionList",
  component: RouteOptionList,
  tags: ["autodocs"],
};

export const Default = {
  render: function ({ routeOptions }) {
    const [activeRoute, setActiveRoute] = useState({
      providerId: "some-provider",
      transportType: TransportType.DOCKED_EBIKE,
    });
    return (
      <RouteOptionList
        routeOptions={routeOptions}
        activeRoute={activeRoute}
        setActiveRoute={setActiveRoute}
      />
    );
  },
  args: {
    routeOptions: [
      {
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
      {
        provider: {
          id: "other-provider",
          name: "Other provider",
        },
        transportType: TransportType.DOCKED_EBIKE,
        extraProperties: {
          fromDockingStations: [
            { id: "lorem", name: "Lorem street, 123" },
            { id: "ipsum", name: "Ipsum street, 123" },
          ],
          toDockingStations: [
            { id: "dolor", name: "Dolor street, 123" },
            { id: "et", name: "Et street, 123" },
          ],
        },
      },
    ],
  },
};
