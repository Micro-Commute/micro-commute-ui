import React from 'react';
import PropTypes from "prop-types";
import LocationInput from './LocationInput';

const SimpleLocationRouteInputForm = ({ onStartingPointChange, onDestinationChange }) => {
  return (
    <div>
      <h2>Simple Location Route Input Form</h2>
      <div>
        <label>Starting Point:</label>
        <LocationInput onLocationChange={onStartingPointChange} />
      </div>
      <div>
        <label>Destination:</label>
        <LocationInput onLocationChange={onDestinationChange} />
      </div>
    </div>
  );
}

SimpleLocationRouteInputForm.propTypes = {
  onStartingPointChange: PropTypes.func.isRequired,
  onDestinationChange: PropTypes.func.isRequired,
}

export default SimpleLocationRouteInputForm;

