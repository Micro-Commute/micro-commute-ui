import React from 'react';
import PropTypes from "prop-types";
import LocationInput from '../LocationInput/LocationInput';

const SimpleLocationRouteInputForm = ({ onStartingPointChange, onDestinationChange }) => {
  return (
    <form>
      <div>
        <label>Starting Point:</label>
        <LocationInput onLocationChange={onStartingPointChange} />
      </div>
      <div>
        <label>Destination:</label>
        <LocationInput onLocationChange={onDestinationChange} />
      </div>
    </form>
  );
}

SimpleLocationRouteInputForm.propTypes = {
  onStartingPointChange: PropTypes.func.isRequired,
  onDestinationChange: PropTypes.func.isRequired,
}

export default SimpleLocationRouteInputForm;

