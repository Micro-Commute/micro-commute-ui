import React from "react";
import {MapContainer, TileLayer} from "react-leaflet";
import "leaflet/dist/leaflet.css"
import {isDomAvailable} from "../../lib/util";
import {RoutePropType} from "../../lib/route";
import DockedEbikeRouteMapFragment from "./DockedEbikeRouteMapFragment";

export default function RouteMap(props) {
  if (!isDomAvailable()) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer style={{ height: "400px" }} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.route && <RouteMapFragment {...props} />}
    </MapContainer>
  )
}

function RouteMapFragment(props) {
  if (props.route.type === "docked-ebike") {
    return <DockedEbikeRouteMapFragment {...props} />
  } else {
    throw TypeError(`Unknown route type: '${props.route.type}'.`);
  }
}

RouteMapFragment.propTypes = {
  route: RoutePropType.isRequired,
}

RouteMap.propTypes = {
  route: RoutePropType,
};
