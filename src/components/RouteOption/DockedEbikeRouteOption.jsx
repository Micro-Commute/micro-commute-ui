import React, { useId } from "react";
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
  const {
    departureTime,
    arrivalTime,
    totalTravelTime,
    takeBikeTime,
    parkBikeTime,
    walkingToDockingStation,
    bikingTime,
    walkingToDestination,
  } = routeOption.travelTimes;

  const fromDockingStations = routeOption.nearByStations.startingPoint;
  const toDockingStations = routeOption.nearByStations.destination;
  const fromDockingStationId = routeOption.selectedStationIds.startingPoint;
  const toDockingStationId = routeOption.selectedStationIds.destination;

  function handleArticleClick(event) {
    if (event.target instanceof HTMLInputElement) {
      return;
    }
    onClick();
  }

  return (
    <article
      onClick={handleArticleClick}
      style={{ backgroundColor: isSelected ? "cyan" : "inherit" }}
      role="option"
      aria-selected={isSelected}
      aria-label={`Docked e-bike route option with ${routeOption.provider.name}.`}
    >
      <header>
        <h1>{routeOption.provider.name}</h1>
      </header>

      {fromDockingStations.length > 0 && toDockingStations.length > 0 ? (
        <div>
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
          <div
            style={{
              marginTop: "16px",
              borderTop: "1px solid #ccc",
              paddingTop: "16px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gridGap: "16px",
            }}
          >
            {/* Column 1 */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                <div>Departure and arrival times</div>
                <div>{`${departureTime} – ${arrivalTime}`}</div>
              </div>
              <div
                style={{
                  marginTop: "8px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div style={{ textAlign: "center" }}>
                    <div>🧍</div>
                    <div>{walkingToDockingStation}</div>
                  </div>
                  <div style={{ margin: "0 8px" }}>{">"}</div>
                  <div style={{ textAlign: "center" }}>
                    <div>🚴</div>
                    <div>{bikingTime}</div>
                  </div>
                  <div style={{ margin: "0 8px" }}>{">"}</div>
                  <div style={{ textAlign: "center" }}>
                    <div>🧍</div>
                    <div>{walkingToDestination}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <div>
                <div>Total travel time</div>
                <div>{totalTravelTime}</div>
              </div>
              <div style={{ marginTop: "8px" }}></div>
            </div>

            {/* Column 3 */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                <div>Take bike at</div>
                <div>{takeBikeTime}</div>
              </div>
              <div style={{ marginTop: "8px" }}>
                <div>Park bike at</div>
                <div>{parkBikeTime}</div>
              </div>
            </div>
          </div>
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
  onClick: PropTypes.func.isRequired,
  onStartingPointStationChange: PropTypes.func.isRequired,
  onDestinationStationChange: PropTypes.func.isRequired,
};

function DockingStationSelector({ label, value, stations, onChange, style }) {
  return (
    <div style={style}>
      <label style={{ display: "block" }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
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
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  style: Style,
};
