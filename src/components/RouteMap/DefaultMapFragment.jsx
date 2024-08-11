import React from "react";
import { Marker, useMap } from "react-leaflet";

export default function DefaultMapFragment({ activeRoute }) {
  const { startingPoint } = activeRoute;
  const map = useMap();

  if (startingPoint) {
    const coordinate = [startingPoint.latitude, startingPoint.longitude];
    map.panTo(coordinate);
    map.setZoom(15);
    return <Marker position={coordinate} />;
  }

  return <></>;
}
