import React from "react";
import { Marker, useMap } from "react-leaflet";

export default function DefaultMapFragment({ startingPoint }) {
  const map = useMap();

  if (startingPoint) {
    const coordinates = [
      startingPoint.coordinates.latitude,
      startingPoint.coordinates.longitude,
    ];
    map.panTo(coordinates);
    map.setZoomAround(coordinates, 15);
    return <Marker position={coordinates} />;
  }

  return <></>;
}
