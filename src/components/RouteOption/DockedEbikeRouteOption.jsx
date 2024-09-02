import React, { useId } from "react";
import PropTypes from "prop-types";
import Style from "react-style-proptype";
import { RouteOptionPropType } from "../../modules/types";
import DockedEbikeRouteOptionDetails from "./DockedEbikeRouteOptionDetails";

import * as dockedEbikeRouteOptionStyles from "./DockedEbikeRouteOption.module.css";

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
    // Do not send click when clicking on an input element
    if (event.target instanceof HTMLInputElement) {
      return;
    }
    onClick();
  }

  return (
    <article
      onClick={handleArticleClick}
      className={dockedEbikeRouteOptionStyles.dockedEbikeRouteOption}
      style={{
        borderLeftStyle: "solid",
        borderLeftWidth: "8px",
        borderLeftColor: isSelected ? "#1071e5" : "#dfe3e8",
        padding: "0.5rem",
      }}
      role="option"
      aria-selected={isSelected}
      aria-label={`Docked bike/e-bike route option with ${routeOption.provider.name}.`}
    >
      <header>
        <h1 style={{ display: "inline" }}>{routeOption.provider.name}</h1>
        <span style={{ marginLeft: "0.2rem" }}>[ Bikes / e-bikes ]</span>
      </header>

      {fromDockingStations.length > 0 && toDockingStations.length > 0 ? (
        <div>
          <div
            className={
              dockedEbikeRouteOptionStyles.dockingStationSelectorWrapper
            }
          >
            <DockingStationSelector
              label="From docking station"
              value={fromDockingStationId}
              stations={fromDockingStations}
              onChange={onStartingPointStationChange}
            />
            <DockingStationSelector
              label="To docking station"
              value={toDockingStationId}
              stations={toDockingStations}
              onChange={onDestinationStationChange}
            />
          </div>
          {(() => {
            if (!isSelected) {
              return <></>;
            }
            switch (routeOption.loading) {
              case "idle":
                return <></>;
              case "pending":
                return <span>Loading...</span>;
              case "succeeded":
                return (
                  <DockedEbikeRouteOptionDetails routeOption={routeOption} />
                );
              case "failed":
                return <span>Failed to load.</span>;
              default:
                throw new TypeError(
                  `Unknown loading status: '${routeOption.loading}'.`,
                );
            }
          })()}
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
function DockingStationSelector({ label, value, stations, onChange }) {
  const labelId = useId();

  const handleChange = (e) => {
    let stationId = e.target.value;
    onChange(stationId);
  };

  return (
    <div>
      <label
        style={{ display: "block" }}
        className={dockedEbikeRouteOptionStyles.label}
        id={labelId}
      >
        {label}
      </label>
      <select
        value={value}
        onChange={handleChange}
        // Prevent DockedEbikeRouteOption 'onClick' when clicking on this select
        onClick={(e) => e.stopPropagation()}
        aria-labelledby={labelId}
        style={{ width: "100%" }}
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
  ).isRequired,
  onChange: PropTypes.func.isRequired, // (dockingStationId) => void
  style: Style,
};
