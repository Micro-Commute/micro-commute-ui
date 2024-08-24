// import React, { useId } from "react";
// import PropTypes from "prop-types";
// import Style from "react-style-proptype";
// import { RouteOptionPropType } from "../../modules/types";

// export default function DockedEbikeRouteOption({
//   routeOption,
//   isSelected,
//   onClick,
//   onStartingPointStationChange,
//   onDestinationStationChange,
// }) {
//   const fromDockingStations = routeOption.nearByStations.startingPoint;
//   const toDockingStations = routeOption.nearByStations.destination;
//   const fromDockingStationId = routeOption.selectedStationIds.startingPoint;
//   const toDockingStationId = routeOption.selectedStationIds.destination;

//   function handleArticleClick(event) {
//     if (event.target instanceof HTMLInputElement) {
//       // Do not send click when clicking on an input element
//       return;
//     }
//     onClick();
//   }

//   return (
//     <article
//       onClick={handleArticleClick}
//       style={{ backgroundColor: isSelected ? "cyan" : "inherit" }}
//       role="option"
//       aria-selected={isSelected}
//       aria-label={`Docked e-bike route option with ${routeOption.provider.name}.`}
//     >
//       <header>
//         <h1>{routeOption.provider.name}</h1>
//       </header>
//       {fromDockingStations.length > 0 && toDockingStations.length > 0 ? (
//         <div style={{ display: "flex" }}>
//           <DockingStationSelector
//             label="From docking station"
//             value={fromDockingStationId}
//             stations={fromDockingStations}
//             onChange={onStartingPointStationChange}
//             style={{ flex: 1 }}
//           />
//           <DockingStationSelector
//             label="To docking station"
//             value={toDockingStationId}
//             stations={toDockingStations}
//             onChange={onDestinationStationChange}
//             style={{ flex: 1 }}
//           />
//         </div>
//       ) : (
//         <em>No nearby docking stations.</em>
//       )}
//     </article>
//   );
// }

// DockedEbikeRouteOption.propTypes = {
//   routeOption: RouteOptionPropType,
//   isSelected: PropTypes.bool.isRequired,
//   onClick: PropTypes.func.isRequired, // () => void
//   onStartingPointStationChange: PropTypes.func.isRequired, // (stationId) => void
//   onDestinationStationChange: PropTypes.func.isRequired, // (stationId) => void
// };

// /** Pre-condition: options.length > 0 */
// function DockingStationSelector({ label, value, stations, onChange, style }) {
//   const labelId = useId();

//   const handleChange = (e) => {
//     let stationId = e.target.value;
//     onChange(stationId);
//   };

//   return (
//     <div style={style}>
//       <label style={{ display: "block" }} id={labelId}>
//         {label}
//       </label>
//       <select
//         value={value}
//         onChange={handleChange}
//         // Prevent DockedEbikeRouteOption 'onClick' when clicking on this select
//         onClick={(e) => e.stopPropagation()}
//         aria-labelledby={labelId}
//       >
//         {stations.map((station) => (
//           <option value={station.id} key={station.id}>
//             {station.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

// DockingStationSelector.propTypes = {
//   label: PropTypes.string.isRequired,
//   value: PropTypes.string.isRequired,
//   stations: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       name: PropTypes.string.isRequired,
//     }),
//   ),
//   onChange: PropTypes.func.isRequired, // (dockingStationId) => void
//   style: Style,
// };



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
  const fromDockingStations = routeOption.nearByStations.startingPoint;
  const toDockingStations = routeOption.nearByStations.destination;
  const fromDockingStationId = routeOption.selectedStationIds.startingPoint;
  const toDockingStationId = routeOption.selectedStationIds.destination;

  const {
    departureTime,
    arrivalTime,
    takeBikeTime,
    parkBikeTime,
    totalTravelTime,
    walkingToDockingStation,
    bikingTime,
    walkingToDestination,
  } = routeOption.travelTimes;

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
      role="option"
      aria-selected={isSelected}
      aria-label={`Docked e-bike route option with ${routeOption.provider.name}.`}
    >
      <header>
        <h1>{routeOption.provider.name}</h1>
      </header>
      {fromDockingStations.length > 0 && toDockingStations.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
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
          <div style={{ marginTop: "10px" }}>
            <h2>Travel Times:</h2>
            <ul>
              <li>Departure Time: {departureTime}</li>
              <li>Arrival Time: {arrivalTime}</li>
              <li>Take Bike Time: {takeBikeTime}</li>
              <li>Park Bike Time: {parkBikeTime}</li>
              <li>Total Travel Time: {totalTravelTime}</li>
              <li>Walking to Docking Station: {walkingToDockingStation}</li>
              <li>Biking Time: {bikingTime}</li>
              <li>Walking to Destination: {walkingToDestination}</li>
            </ul>
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
  ),
  onChange: PropTypes.func.isRequired, // (dockingStationId) => void
  style: Style,
};
