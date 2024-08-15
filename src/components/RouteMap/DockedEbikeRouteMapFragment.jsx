import { CircleMarker, Marker, Polyline, useMap } from "react-leaflet";
import React from "react";
import L from "leaflet";
import {
  CoordinatesPropType,
  RouteOptionPropType,
  RoutePropType,
} from "../../modules/types";

export default function DockedEbikeRouteMapFragment({
  startingPoint,
  destination,
  routeOption,
}) {
  const stationAtStartingPoint = getDockingStationAtStartingPoint(routeOption);
  const stationAtDestination = getDockingStationAtDestination(routeOption);
  const latLng = ({ coordinates }) => [
    coordinates.latitude,
    coordinates.longitude,
  ];

  const nearByStationCoords = {
    startingPoint: routeOption.nearByStations.startingPoint.map(latLng),
    destination: routeOption.nearByStations.destination.map(latLng),
  };

  const routeCoords = {
    startingPoint: latLng(startingPoint),
    fromDockingStation: latLng(stationAtStartingPoint),
    toDockingStation: latLng(stationAtDestination),
    destination: latLng(destination),
  };

  const map = useMap();
  const bounds = new L.LatLngBounds(Object.values(routeCoords));
  map.fitBounds(bounds, { padding: [50, 50] });

  return (
    <>
      {nearByStationCoords.startingPoint.map((coords) => (
        <CircleMarker
          center={coords}
          radius={4}
          pathOptions={{ fillColor: "white", fillOpacity: 0.75, opacity: 0.75 }}
        />
      ))}
      {nearByStationCoords.destination.map((coords) => (
        <CircleMarker
          center={coords}
          radius={4}
          pathOptions={{ fillColor: "white", fillOpacity: 0.75, opacity: 0.75 }}
        />
      ))}
      <Polyline
        positions={Object.values(routeCoords)}
        pathOptions={{ weight: 8 }}
      />
      <CircleMarker
        center={routeCoords.startingPoint}
        radius={4}
        pathOptions={{ fillColor: "white", fillOpacity: 0.5 }}
      />
      <CircleMarker
        center={routeCoords.fromDockingStation}
        radius={4}
        pathOptions={{ fillColor: "white", fillOpacity: 0.5 }}
      />
      <CircleMarker
        center={routeCoords.toDockingStation}
        radius={4}
        pathOptions={{ fillColor: "white", fillOpacity: 0.5 }}
      />
      <CircleMarker
        center={routeCoords.destination}
        radius={5}
        pathOptions={{ color: "black", fillColor: "white", fillOpacity: 1.0 }}
      />
      <Marker position={routeCoords.startingPoint} />
    </>
  );
}

DockedEbikeRouteMapFragment.propTypes = {
  startingPoint: CoordinatesPropType,
  destination: CoordinatesPropType,
  routeOption: RouteOptionPropType,
  concreteRoute: RoutePropType,
};

/**
 * @param {DockedEBikeRouteOptionDTO} routeOption
 * @return {DockingStation}
 */
function getDockingStationAtStartingPoint(routeOption) {
  const stationId = routeOption.selectedStationIds.startingPoint;
  const nearByStations = routeOption.nearByStations;
  return nearByStations.startingPoint.find((s) => s.id === stationId);
}

/**
 * @param {DockedEBikeRouteOptionDTO} routeOption
 * @return {DockingStation}
 */
function getDockingStationAtDestination(routeOption) {
  const stationId = routeOption.selectedStationIds.destination;
  const nearByStations = routeOption.nearByStations;
  return nearByStations.destination.find((s) => s.id === stationId);
}
