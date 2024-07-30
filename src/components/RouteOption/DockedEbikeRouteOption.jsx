import React from "react";
import PropTypes from "prop-types";
import Style from "react-style-proptype";

export default function DockedEbikeRouteOption(props) {
  let stationCount =
    props.fromDockingStations.length + props.toDockingStations.length;
  return (
    <article>
      <header>
        <h1>{props.provider.name}</h1>
      </header>
      {stationCount > 0 ? (
        <div style={{ display: "flex" }}>
          <DockingStationSelector
            label="From docking station"
            value="fromDockingStation"
            options={props.fromDockingStations}
            onChange={props.onDockingStationChange}
            style={{ flex: 1 }}
          />
          <DockingStationSelector
            label="To docking station"
            value="toDockingStation"
            options={props.toDockingStations}
            onChange={props.onDockingStationChange}
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
  provider: PropTypes.shape({
    name: PropTypes.string.isRequired,
  }),
  fromDockingStations: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  toDockingStations: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  onDockingStationChange: PropTypes.func.isRequired,
};

DockedEbikeRouteOption.TYPE = "docked-ebike";

function DockingStationSelector({ label, value, options, onChange, style }) {
  return (
    <div style={style}>
      <label style={{ display: "block" }}>{label}</label>
      <select value={value} onChange={onChange}>
        {options.map((option) => (
          <option value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}

DockingStationSelector.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ),
  style: Style,
};
