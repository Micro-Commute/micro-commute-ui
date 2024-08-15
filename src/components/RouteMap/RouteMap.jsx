import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { isDomAvailable } from "../../modules/util";
import DockedEbikeRouteMapFragment from "./DockedEbikeRouteMapFragment";
import Style from "react-style-proptype";
import { TransportType } from "../../modules/types";
import DefaultMapFragment from "./DefaultMapFragment";

export default function RouteMap(props) {
  if (!isDomAvailable()) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer
      style={props.style}
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {props.activeRoute && <RouteMapFragment {...props} />}
    </MapContainer>
  );
}

RouteMap.propTypes = {
  activeRoute: RoutePropType,
  style: Style,
};

RouteMap.defaultProps = {
  style: {
    height: "400px",
  },
};

function RouteMapFragment({ activeRoute }) {
  if (!activeRoute.transportType) {
    return <DefaultMapFragment activeRoute={activeRoute} />;
  } else if (activeRoute.transportType === TransportType.DOCKED_EBIKE) {
    return <DockedEbikeRouteMapFragment activeRoute={activeRoute} />;
  } else {
    throw TypeError(`Unknown route type: '${activeRoute.transportType}'.`);
  }
}

RouteMapFragment.propTypes = {
  activeRoute: RoutePropType,
};
