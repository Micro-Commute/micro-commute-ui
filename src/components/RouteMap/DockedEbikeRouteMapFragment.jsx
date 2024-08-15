import { CircleMarker, Marker, Polyline, useMap } from "react-leaflet";
import React from "react";
import L from "leaflet";
import { RoutePropType } from "../../modules/types";

export default function DockedEbikeRouteMapFragment({ activeRoute }) {
  const { startingPoint, destination } = activeRoute;
  const { fromDockingStation, toDockingStation } = activeRoute.extraProperties;
  const latLng = ({ latitude, longitude }) => [latitude, longitude];

  const coordinates = {
    startingPoint: latLng(startingPoint),
    fromDockingStation: latLng(fromDockingStation),
    toDockingStation: latLng(toDockingStation),
    destination: latLng(destination),
  };

  const map = useMap();
  const bounds = new L.LatLngBounds(Object.values(coordinates));
  map.fitBounds(bounds, { padding: [50, 50] });

  return (
    <>
      <Polyline
        positions={Object.values(coordinates)}
        pathOptions={{ weight: 8 }}
      />
      <CircleMarker
        center={coordinates.startingPoint}
        radius={4}
        pathOptions={{ fillColor: "white", fillOpacity: 0.5 }}
      />
      <CircleMarker
        center={coordinates.fromDockingStation}
        radius={4}
        pathOptions={{ fillColor: "white", fillOpacity: 0.5 }}
      />
      <CircleMarker
        center={coordinates.toDockingStation}
        radius={4}
        pathOptions={{ fillColor: "white", fillOpacity: 0.5 }}
      />
      <CircleMarker
        center={coordinates.destination}
        radius={5}
        pathOptions={{ color: "black", fillColor: "white", fillOpacity: 1.0 }}
      />
      <Marker position={coordinates.startingPoint} />
    </>
  );
}

DockedEbikeRouteMapFragment.propTypes = {
  activeRoute: RoutePropType,
};
