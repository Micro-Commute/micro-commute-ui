import React, {useState} from "react";
import PropTypes from "prop-types";
import Style from "react-style-proptype";

export default function DockedEbikeRouteOption(props) {
  const nStationsFrom = props.fromDockingStations.length;
  const nStationsTo = props.toDockingStations.length;

  const style = {
    backgroundColor: props.isSelected ? "cyan" : "inherit",
  };

  return (
    <article onClick={props.onClick} style={style}>
      <header>
        <h1>{props.provider.name}</h1>
      </header>
      {nStationsFrom > 0 && nStationsTo > 0 ? (
        <div style={{ display: "flex" }}>
          <DockingStationSelector
            label="From docking station"
            stations={props.fromDockingStations}
            onSelect={props.onFromDockingStationSelect}
            style={{ flex: 1 }}
          />
          <DockingStationSelector
            label="To docking station"
            stations={props.toDockingStations}
            onSelect={props.onToDockingStationSelect}
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
    id: PropTypes.string.isRequired,
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
  onFromDockingStationSelect: PropTypes.func.isRequired,
  onToDockingStationSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

DockedEbikeRouteOption.defaultProps = {
  isSelected: false,
};

DockedEbikeRouteOption.TYPE = "docked-ebike";

/** Pre-condition: options.length > 0 */
function DockingStationSelector({ label, stations, onSelect, style }) {
  const [selectedStation, setSelectedStation] = useState(stations[0].id);

  const handleChange = (e) => {
    let stationId = e.target.value;
    setSelectedStation(stationId);
    onSelect(stationId);
  }

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
