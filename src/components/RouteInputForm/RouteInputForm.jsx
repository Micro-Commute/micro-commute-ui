import React from "react";
import PropTypes from "prop-types";
import LocationInput from "../LocationInput/LocationInput";
import DateTimeInput from "../DateTimeInput/DateTimeInput";

const RouteInputForm = ({ onStartingPointChange, onDestinationChange,  onArriveByDateTimeChanged,
  arriveByValue }) => {
  return (
    <form>
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
          value={arriveByValue}
          onChange={onArriveByDateTimeChanged}
          ariaLabelledBy="arrive-by-label"
        />
      </div>
    </form>
  );
};

RouteInputForm.propTypes = {
  onStartingPointChange: PropTypes.func.isRequired,
  onDestinationChange: PropTypes.func.isRequired,
  onArriveByDateTimeChanged: PropTypes.func.isRequired,
  arriveByValue: PropTypes.string.isRequired,
};

export default RouteInputForm;
