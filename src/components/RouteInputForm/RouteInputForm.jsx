import React from "react";
import PropTypes from "prop-types";
import LocationInput from "../LocationInput/LocationInput";
import DateTimeInput from "../DateTimeInput/DateTimeInput";

const RouteInputForm = ({
  startingPointValue,
  onStartingPointChange,
  destinationValue,
  onDestinationChange,
  arriveByDateTimeValue,
  onArriveByDateTimeChange,
  orientation,
  styleOverrides = undefined,
}) => {
  const inputWidth = orientation === "column" ? "250px" : undefined;
  return (
    <form
      style={{
        display: "flex",
        alignItems: "stretch",
        flexDirection: orientation,
        gap: "0.5rem",
        ...(styleOverrides || {}),
      }}
    >
      <div>
        <label id="starting-point-label">Starting point</label>
        <LocationInput
          locationValue={startingPointValue}
          onLocationChange={onStartingPointChange}
          ariaLabelledBy="starting-point-label"
          style={{width: inputWidth}}
        />
      </div>
      <div>
        <label id="destination-label">Destination</label>
        <LocationInput
          locationValue={destinationValue}
          onLocationChange={onDestinationChange}
          ariaLabelledBy="destination-label"
          style={{width: inputWidth }}
        />
      </div>
      <div>
        <label id="arrive-by-label">Arrive By</label>
        <DateTimeInput
          value={arriveByDateTimeValue}
          onChange={onArriveByDateTimeChange}
          style={{width: inputWidth }}
        />
      </div>
    </form>
  );
};

RouteInputForm.propTypes = {
  startingPointValue: PropTypes.shape({
    address: PropTypes.string,
    coordinates: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
  }),
  onStartingPointChange: PropTypes.func.isRequired,
  destinationValue: PropTypes.shape({
    address: PropTypes.string,
    coordinates: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
  }),
  onDestinationChange: PropTypes.func.isRequired,
  arriveByDateTimeValue: PropTypes.string,
  onArriveByDateTimeChange: PropTypes.func.isRequired,
  orientation: PropTypes.oneOf(["column", "row"]).isRequired,
};

export default RouteInputForm;
