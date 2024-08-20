import React from "react";
import PropTypes from "prop-types";
import LocationInput from "../LocationInput/LocationInput";

const RouteInputForm = ({ onStartingPointChange, onDestinationChange }) => {
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
    </form>
  );
};

RouteInputForm.propTypes = {
  onStartingPointChange: PropTypes.func.isRequired,
  onDestinationChange: PropTypes.func.isRequired,
};

export default RouteInputForm;
