import React from "react";
import {MapContainer, Marker, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css"
import {isDomAvailable} from "../../lib/util";

export default function RouteMap() {
  if (!isDomAvailable()) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer style={{ height: "400px" }} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}/>
    </MapContainer>
  )
}
