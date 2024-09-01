import { CircleMarker, Marker, Pane, Polyline, useMap } from "react-leaflet";
import React from "react";
import L from "leaflet";
import { CoordinatesPropType, RouteOptionPropType } from "../../modules/types";
import { first, last } from "../../modules/util.js";

// The Leaflet tiles (basemap) z-index is 200
const Z_INDEX_BASE = 200;

export default function DockedEbikeRouteMapFragment({
  startingPoint,
  destination,
  routeOption,
}) {
  const stationAtStartingPoint = getDockingStationAtStartingPoint(routeOption);
  const stationAtDestination = getDockingStationAtDestination(routeOption);

  const nearByStationCoords = {
    startingPoint: routeOption.nearByStations.startingPoint.map(latLng),
    destination: routeOption.nearByStations.destination.map(latLng),
  };

  const markerCoords = {
    startingPoint: latLng(startingPoint),
    fromDockingStation: latLng(stationAtStartingPoint),
    toDockingStation: latLng(stationAtDestination),
    destination: latLng(destination),
  };

  const map = useMap();
  const bounds = new L.LatLngBounds(Object.values(markerCoords));
  map.fitBounds(bounds, { padding: [50, 50] });

  return (
    <>
      <Pane name="nearby-docking-stations" style={{ zIndex: Z_INDEX_BASE + 1 }}>
        {nearByStationCoords.startingPoint.map((coords) => (
          <CircleMarker
            center={coords}
            radius={4}
            pathOptions={{
              color: "grey",
              fillColor: "white",
              fillOpacity: 0.75,
              opacity: 0.75,
            }}
          />
        ))}
        {nearByStationCoords.destination.map((coords) => (
          <CircleMarker
            center={coords}
            radius={4}
            pathOptions={{
              color: "grey",
              fillColor: "white",
              fillOpacity: 0.75,
              opacity: 0.75,
            }}
          />
        ))}
      </Pane>
      <Pane name="route-polylines" style={{ zIndex: Z_INDEX_BASE + 2 }}>
        {routeOption.details ? (
          <RoutePolyLinesPaneFragment
            routeOption={routeOption}
            markerCoords={markerCoords}
          />
        ) : (
          // Show dashed 'as the crow flies' line while route details load
          <Polyline
            positions={Object.values(markerCoords)}
            pathOptions={{ weight: 8, dashArray: "1, 50" }}
          />
        )}
      </Pane>
      <Pane name="route-markers" style={{ zIndex: Z_INDEX_BASE + 3 }}>
        <CircleMarker
          center={markerCoords.startingPoint}
          radius={7}
          pathOptions={{ fillColor: "white", fillOpacity: 0.5 }}
        />
        <CircleMarker
          center={markerCoords.fromDockingStation}
          radius={7}
          pathOptions={{ fillColor: "white", fillOpacity: 0.5 }}
        />
        <CircleMarker
          center={markerCoords.toDockingStation}
          radius={7}
          pathOptions={{ fillColor: "white", fillOpacity: 0.5 }}
        />
        <CircleMarker
          center={markerCoords.destination}
          radius={8}
          pathOptions={{ color: "black", fillColor: "white", fillOpacity: 1.0 }}
        />
      </Pane>
      <Marker
        alt="Starting point marker"
        title={startingPoint.address}
        position={markerCoords.startingPoint}
      />
    </>
  );
}

DockedEbikeRouteMapFragment.propTypes = {
  startingPoint: CoordinatesPropType,
  destination: CoordinatesPropType,
  routeOption: RouteOptionPropType,
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

/** Create Leaflet coordinate from Micro-Commute Location object. */
const latLng = ({ coordinates }) => [
  coordinates.latitude,
  coordinates.longitude,
];

function RoutePolyLinesPaneFragment({ routeOption, markerCoords }) {
  const geoJsonFeatures = routeOption.details.featureCollection.features;
  const routeCoords = {
    walkingFromStartingPoint: latLngFromGeoJson(geoJsonFeatures[0]),
    cyclingFromStationToStation: latLngFromGeoJson(geoJsonFeatures[1]),
    walkingToDestination: latLngFromGeoJson(geoJsonFeatures[2]),
  };

  if (
    routeCoords.walkingFromStartingPoint.length === 0 ||
    routeCoords.cyclingFromStationToStation.length === 0 ||
    routeCoords.walkingToDestination === 0
  ) {
    return <></>;
  }

  const continuous = { weight: 12 };
  const dotted = { weight: 12, dashArray: "1, 14" };

  return (
    <>
      {/* Dotted line from starting point to start of walking route. */}
      <Polyline
        pathOptions={dotted}
        positions={[
          markerCoords.startingPoint,
          first(routeCoords.walkingFromStartingPoint),
        ]}
      />
      {/* Walking route from starting point to first docking station. */}
      <Polyline
        pathOptions={continuous}
        positions={routeCoords.walkingFromStartingPoint}
      />
      {/* Dotted line from end of walking route to first docking station. */}
      <Polyline
        pathOptions={dotted}
        positions={[
          last(routeCoords.walkingFromStartingPoint),
          markerCoords.fromDockingStation,
        ]}
      />
      {/* Cycling route from first docking station to second docking station. */}
      <Polyline
        pathOptions={continuous}
        positions={routeCoords.cyclingFromStationToStation}
      />
      {/* Dotted line from end of cycling route to second docking station. */}
      <Polyline
        pathOptions={dotted}
        positions={[
          last(routeCoords.cyclingFromStationToStation),
          markerCoords.toDockingStation,
        ]}
      />
      {/* Walking route from second docking station to destination. */}
      <Polyline
        pathOptions={continuous}
        positions={routeCoords.walkingToDestination}
      />
      {/* Dotted line from end of route to destination. */}
      <Polyline
        pathOptions={dotted}
        positions={[
          last(routeCoords.walkingToDestination),
          markerCoords.destination,
        ]}
      />
    </>
  );
}

/** Create array of Leaflet coordinates from GeoJSON feature geometry. */
function latLngFromGeoJson(feature) {
  return feature.geometry.coordinates.map((coords) => [coords[1], coords[0]]);
}
