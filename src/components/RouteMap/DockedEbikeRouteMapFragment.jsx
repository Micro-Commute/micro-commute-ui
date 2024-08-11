import { DockedEbikeRoutePropType } from "../../lib/route";
import { Marker, useMap } from "react-leaflet";
import React from "react";
import L from "leaflet";

export default function DockedEbikeRouteMapFragment({ route }) {
  const coordinates = [
    route.startingPoint,
    route.startingPointDockingStation,
    route.destinationDockingStation,
    route.destination,
  ];

  const map = useMap();
  map.fitBounds(new L.LatLngBounds(coordinates), { padding: [25, 25] });
  L.polyline(coordinates).addTo(map);

  return (
    <>
      <Marker position={[51.505, -0.09]} />
      <Marker position={route.startingPoint} />
      <Marker position={route.startingPointDockingStation} />
      <Marker position={route.destinationDockingStation} />
      <Marker position={route.destination} />
    </>
  );
}

DockedEbikeRouteMapFragment.propTypes = {
  route: DockedEbikeRoutePropType.isRequired,
};
