import React, { useState } from "react";
import RouteMap from "../components/RouteMap/RouteMap";
import RouteInputForm from "../components/RouteInputForm/RouteInputForm";
import RouteOptionList from "../components/RouteOptionList/RouteOptionList";
import { fn } from "@storybook/test";
import { gql, useQuery } from "@apollo/client";

export const LIST_ROUTE_OPTIONS_QUERY = gql`
  query ListRouteOptions(
    $startingPointLongitude: Float!
    $startingPointLatitude: Float!
    $destinationLongitude: Float!
    $destinationLatitude: Float!
  ) {
    listRouteOptions(
      startingPointLongitude: $startingPointLongitude
      startingPointLatitude: $startingPointLatitude
      destinationLongitude: $destinationLongitude
      destinationLatitude: $destinationLatitude
    ) {
      ... on DockedEBikeRouteOption {
        provider {
          id
          name
        }
        fromDockingStations {
          id
          name
          location {
            longitude
            latitude
          }
        }
        toDockingStations {
          id
          name
          location {
            longitude
            latitude
          }
        }
      }
    }
  }
`;

export default function PlanATripPage() {
  const [startingPoint, setStartingPoint] = useState(null);
  const [destination, setDestination] = useState(null);

  const { loading, error, data } = useQuery(LIST_ROUTE_OPTIONS_QUERY, {
    variables: {
      startingPointLongitude: startingPoint && startingPoint.longitude,
      startingPointLatitude: startingPoint && startingPoint.latitude,
      destinationLongitude: destination && destination.longitude,
      destinationLatitude: destination && destination.latitude,
    },
    skip: !startingPoint || !destination,
  });

  function SidebarContent() {
    if (loading) {
      return <span>Loading...</span>;
    }
    if (error) {
      return <span>An error occurred</span>;
    }
    if (data) {
      return (
        <RouteOptionList
          routeOptionProps={createRouteOptionProps(data)}
          onRouteOptionSelected={fn()}
        />
      );
    }
    return <></>;
  }

  return (
    <main style={{ height: "100vh" }}>
      <aside style={{ width: "350px", float: "left" }}>
        <RouteInputForm
          onStartingPointChange={location => setStartingPoint(location.coordinates)}
          onDestinationChange={location => setDestination(location.coordinates)}
        />
        <SidebarContent />
      </aside>
      <RouteMap style={{ height: "100%" }}/>
    </main>
  );
}

function createRouteOptionProps(data) {
  if (data) {
    return data["listRouteOptions"]
      .map((routeOption) => {
        switch (routeOption["__typename"]) {
          case "DockedEBikeRouteOption":
            return createDockedEbikeRouteOptionProps(routeOption);
          default:
            console.log(`Unknown type: '${routeOption["__typename"]}'.`);
            return null;
        }
      })
      .filter((option) => option);
  } else {
    return [];
  }
}

function createDockedEbikeRouteOptionProps(data) {
  const mapDockingStation = (station) => ({
    id: station["id"],
    name: station["name"],
  });

  return {
    type: "docked-ebike",
    provider: {
      id: data["provider"]["id"],
      name: data["provider"]["name"],
    },
    fromDockingStations: data["fromDockingStations"].map(mapDockingStation),
    toDockingStations: data["toDockingStations"].map(mapDockingStation),
    onDockingStationChange: fn(),
  };
}
