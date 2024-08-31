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
                          orientation = "column",
                        }) => {
  return (
      <form
          style={{
            display: "flex",
            flexDirection: orientation,
            gap: "1.5rem",  // Adjusted gap between form fields
          }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label id="starting-point-label">Starting point</label>
          <LocationInput
              locationValue={startingPointValue}
              onLocationChange={onStartingPointChange}
              ariaLabelledBy="starting-point-label"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label id="destination-label">Destination</label>
          <LocationInput
              locationValue={destinationValue}
              onLocationChange={onDestinationChange}
              ariaLabelledBy="destination-label"
          />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <label id="arrive-by-label">Arrive By</label>
          <DateTimeInput
              value={arriveByDateTimeValue}
              onChange={onArriveByDateTimeChange}
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
  arriveByDateTimeValue: PropTypes.string.isRequired,
  onArriveByDateTimeChange: PropTypes.func.isRequired,
  orientation: PropTypes.oneOf(["column", "row"]),
};

export default RouteInputForm;
