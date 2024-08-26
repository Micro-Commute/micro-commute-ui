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
    leaveAt,
    arriveAt,
    takeBikeAt,
    parkBikeAt,
    travelTimeTotal,
    walkingTimeFromStartingPoint,
    cyclingTimeStationToStation,
    walkingTimeToDestination,
  } = routeOption.details || {};

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
                <div>{`${leaveAt} – ${arriveAt}`}</div>
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
                    <div>{walkingTimeFromStartingPoint}</div>
                  </div>
                  <div style={{ margin: "0 8px" }}>{">"}</div>
                  <div style={{ textAlign: "center" }}>
                    <div>🚴</div>
                    <div>{cyclingTimeStationToStation}</div>
                  </div>
                  <div style={{ margin: "0 8px" }}>{">"}</div>
                  <div style={{ textAlign: "center" }}>
                    <div>🧍</div>
                    <div>{walkingTimeToDestination}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <div>
                <div>Total travel time</div>
                <div>{travelTimeTotal}</div>
              </div>
              <div style={{ marginTop: "8px" }}></div>
            </div>

            {/* Column 3 */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                <div>Take bike at</div>
                <div>{takeBikeAt}</div>
              </div>
              <div style={{ marginTop: "8px" }}>
                <div>Park bike at</div>
                <div>{parkBikeAt}</div>
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
  onClick: PropTypes.func.isRequired, // () => void
  onStartingPointStationChange: PropTypes.func.isRequired, // (stationId) => void
  onDestinationStationChange: PropTypes.func.isRequired, // (stationId) => void
};

/** Pre-condition: options.length > 0 */
function DockingStationSelector({ label, value, stations, onChange, style }) {
  const labelId = useId();

  const handleChange = (e) => {
    let stationId = e.target.value;
    onChange(stationId);
  };

  return (
    <div style={style}>
      <label style={{ display: "block" }} id={labelId}>
        {label}
      </label>
      <select
        value={value}
        onChange={handleChange}
        // Prevent DockedEbikeRouteOption 'onClick' when clicking on this select
        onClick={(e) => e.stopPropagation()}
        aria-labelledby={labelId}
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
