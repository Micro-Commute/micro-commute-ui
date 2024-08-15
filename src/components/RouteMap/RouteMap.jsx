import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { isDomAvailable } from "../../modules/util";
import DockedEbikeRouteMapFragment from "./DockedEbikeRouteMapFragment";
import Style from "react-style-proptype";
import { TransportType } from "../../modules/types";
import DefaultMapFragment from "./DefaultMapFragment";
import { useSelector } from "react-redux";
import {
  selectDestination,
  selectSelectedRouteOption,
  selectStartingPoint,
} from "../../modules/planatrip/planATripSlice";

export default function RouteMap({ style }) {
  const startingPoint = useSelector(selectStartingPoint);
  const destination = useSelector(selectDestination);
  const routeOption = useSelector(selectSelectedRouteOption);

  if (!isDomAvailable()) {
    return <div>Loading...</div>;
  }

  return (
    <MapContainer
      style={style}
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {(() => {
        if (!routeOption) {
          return <DefaultMapFragment startingPoint={startingPoint} />;
        } else if (routeOption.transportType === TransportType.DOCKED_EBIKE) {
          return (
            <DockedEbikeRouteMapFragment
              startingPoint={startingPoint}
              destination={destination}
              routeOption={routeOption}
            />
          );
        } else {
          throw TypeError(
            `Unknown route type: '${routeOption.transportType}'.`,
          );
        }
      })()}
    </MapContainer>
  );
}

RouteMap.propTypes = {
  style: Style,
};

RouteMap.defaultProps = {
  style: {
    height: "400px",
  },
};
