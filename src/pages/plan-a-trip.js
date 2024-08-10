import React, { useState } from "react";
import RouteMap from "../components/RouteMap/RouteMap";
import RouteInputForm from "../components/RouteInputForm/RouteInputForm";
import RouteOptionList from "../components/RouteOptionList/RouteOptionList";
import { gql, useQuery } from "@apollo/client";
import { TransportType } from "../lib/types";

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

function useListRouteOptionsQuery({ startingPoint, destination }) {
  return useQuery(LIST_ROUTE_OPTIONS_QUERY, {
    variables: {
      startingPointLongitude: startingPoint && startingPoint.longitude,
      startingPointLatitude: startingPoint && startingPoint.latitude,
      destinationLongitude: destination && destination.longitude,
      destinationLatitude: destination && destination.latitude,
    },
    skip: !startingPoint || !destination,
  });
}

const initialActiveRoute = () => ({
  providerId: undefined,
  transportType: undefined,
  startingPoint: undefined,
  destination: undefined,
});

export default function PlanATripPage() {
  const [activeRoute, setActiveRoute] = useState(initialActiveRoute);
  const { loading, error, data } = useListRouteOptionsQuery(activeRoute);
  const routeOptions = createRouteOptions(data);

  if (routeOptions.length > 0 && !activeRoute.providerId) {
    setActiveRoute((activeRoute) => ({
      ...activeRoute,
      providerId: routeOptions[0].provider.id,
      transportType: routeOptions[0].transportType,
    }));
  }

  function handleStartingPointChange(location) {
    setActiveRoute((activeRoute) => ({
      ...activeRoute,
      startingPoint: location.coordinates,
    }));
  }

  function handleDestinationChange(location) {
    setActiveRoute((activeRoute) => ({
      ...activeRoute,
      destination: location.coordinates,
    }));
  }

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
          routeOptions={createRouteOptions(data)}
          activeRoute={activeRoute}
          setActiveRoute={setActiveRoute}
        />
      );
    }
    return <></>;
  }

  return (
    <main style={{ height: "100vh" }}>
      <aside style={{ width: "350px", float: "left" }}>
        <RouteInputForm
          onStartingPointChange={handleStartingPointChange}
          onDestinationChange={handleDestinationChange}
        />
        <SidebarContent />
      </aside>
      <RouteMap style={{ height: "100%" }} />
    </main>
  );
}

function createRouteOptions(data) {
  if (data) {
    return data["listRouteOptions"]
      .map((routeOptionData) => {
        switch (routeOptionData["__typename"]) {
          case "DockedEBikeRouteOption":
            return createDockedEbikeRouteOption(routeOptionData);
          default:
            console.log(`Unknown type: '${routeOptionData["__typename"]}'.`);
            return null;
        }
      })
      .filter((option) => option);
  } else {
    return [];
  }
}

function createDockedEbikeRouteOption(data) {
  const mapDockingStation = (station) => ({
    id: station["id"],
    name: station["name"],
  });

  return {
    provider: {
      id: data["provider"]["id"],
      name: data["provider"]["name"],
    },
    transportType: TransportType.DOCKED_EBIKE,
    extraProperties: {
      fromDockingStations: data["fromDockingStations"].map(mapDockingStation),
      toDockingStations: data["toDockingStations"].map(mapDockingStation),
    },
  };
}
