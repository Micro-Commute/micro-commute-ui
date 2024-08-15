import React from "react";
import PropTypes from "prop-types";
import Style from "react-style-proptype";
import { RouteOptionPropType } from "../../modules/types";

export default function DockedEbikeRouteOption({
  routeOption,
  isSelected,
  onClick,
  onStartingPointStationChange,
  onDestinationStationChange,
}) {
  const fromDockingStations = routeOption.nearByStations.startingPoint;
  const toDockingStations = routeOption.nearByStations.destination;
  const fromDockingStationId = routeOption.selectedStationIds.startingPoint;
  const toDockingStationId = routeOption.selectedStationIds.destination;

  function handleArticleClick(event) {
    if (event.target instanceof HTMLInputElement) {
      // Do not send click when clicking on an input element
      return;
    }
    onClick();
  }

  return (
    <article
      onClick={handleArticleClick}
      style={{ backgroundColor: isSelected ? "cyan" : "inherit" }}
    >
      <header>
        <h1>{routeOption.provider.name}</h1>
      </header>
      {fromDockingStations.length > 0 && toDockingStations.length > 0 ? (
        <div style={{ display: "flex" }}>
          <DockingStationSelector
            label="From docking station"
            value={fromDockingStationId}
            stations={fromDockingStations}
            onChange={onStartingPointStationChange}
            style={{ flex: 1 }}
          />
          <DockingStationSelector
            label="To docking station"
            value={toDockingStationId}
            stations={toDockingStations}
            onChange={onDestinationStationChange}
            style={{ flex: 1 }}
          />
        </div>
      ) : (
        <em>No nearby docking stations.</em>
      )}
    </article>
  );
}

DockedEbikeRouteOption.propTypes = {
  routeOption: RouteOptionPropType,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired, // () => void
  onStartingPointStationChange: PropTypes.func.isRequired, // (stationId) => void
  onDestinationStationChange: PropTypes.func.isRequired, // (stationId) => void
};

/** Pre-condition: options.length > 0 */
function DockingStationSelector({ label, value, stations, onChange, style }) {
  const handleChange = (e) => {
    let stationId = e.target.value;
    onChange(stationId);
  };

  return (
    <div style={style}>
      <label style={{ display: "block" }}>{label}</label>
      <select
        value={value}
        onChange={handleChange}
        // Prevent DockedEbikeRouteOption 'onClick' when clicking on this select
        onClick={(e) => e.stopPropagation()}
      >
        {stations.map((station) => (
          <option value={station.id} key={station.id}>
            {station.name}
          </option>
        ))}
      </select>
    </div>
  );
}

DockingStationSelector.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  stations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  onChange: PropTypes.func.isRequired, // (dockingStationId) => void
  style: Style,
};
