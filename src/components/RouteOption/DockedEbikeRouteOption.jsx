import React, { useState } from "react";
import PropTypes from "prop-types";
import Style from "react-style-proptype";
import { RouteOptionPropType } from "../../modules/types";

export default function DockedEbikeRouteOption({
  routeOption,
  isSelected,
  onClick,
}) {
  const { fromDockingStations } = routeOption.extraProperties;
  const { toDockingStations } = routeOption.extraProperties;

  return (
    <article
      onClick={onClick}
      style={{ backgroundColor: isSelected ? "cyan" : "inherit" }}
    >
      <header>
        <h1>{routeOption.provider.name}</h1>
      </header>
      {fromDockingStations.length > 0 && toDockingStations.length > 0 ? (
        <div style={{ display: "flex" }}>
          <DockingStationSelector
            label="From docking station"
            stations={fromDockingStations}
            onSelect={() => null}
            style={{ flex: 1 }}
          />
          <DockingStationSelector
            label="To docking station"
            stations={toDockingStations}
            onSelect={() => null}
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
  routeOption: RouteOptionPropType.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

DockedEbikeRouteOption.defaultProps = {
  isSelected: false,
};

/** Pre-condition: options.length > 0 */
function DockingStationSelector({ label, stations, onSelect, style }) {
  const [selectedStation, setSelectedStation] = useState(stations[0].id);

  const handleChange = (e) => {
    let stationId = e.target.value;
    setSelectedStation(stationId);
    onSelect(stationId);
  };

  return (
    <div style={style}>
      <label style={{ display: "block" }}>{label}</label>
      <select value={selectedStation.id} onChange={handleChange}>
        {stations.map((option) => (
          <option value={option.id}>{option.name}</option>
        ))}
      </select>
    </div>
  );
}

DockingStationSelector.propTypes = {
  label: PropTypes.string.isRequired,
  stations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ),
  onSelect: PropTypes.func.isRequired,
  style: Style,
};
