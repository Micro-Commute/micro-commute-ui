import React from "react";
import PropTypes from "prop-types";
import LocationInput from "../LocationInput/LocationInput";
import DateTimeInput from "../DateTimeInput/DateTimeInput";

const RouteInputForm = ({
  onStartingPointChange,
  onDestinationChange,
  onArriveByDateTimeChange,
  arriveByDateTimeValue,
  orientation = "column",
}) => {
  return (
    <form
      style={{ display: "flex", flexDirection: orientation, gap: "0.5rem" }}
    >
      <div>
        <label id="starting-point-label">Starting point</label>
        <LocationInput
          onLocationChange={onStartingPointChange}
          ariaLabelledBy="starting-point-label"
        />
      </div>
      <div>
        <label id="destination-label">Destination</label>
        <LocationInput
          onLocationChange={onDestinationChange}
          ariaLabelledBy="destination-label"
        />
      </div>
      <div>
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
  onStartingPointChange: PropTypes.func.isRequired,
  onDestinationChange: PropTypes.func.isRequired,
  onArriveByDateTimeChange: PropTypes.func.isRequired,
  arriveByDateTimeValue: PropTypes.string.isRequired,
  orientation: PropTypes.oneOf(["column", "row"]),
};

export default RouteInputForm;
