import React from "react";
import PropTypes from "prop-types";
import LocationInput from "../LocationInput/LocationInput";
import DateTimeInput from "../DateTimeInput/DateTimeInput";

import * as routeInputFormStyles from "./RouteInputForm.module.css";

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
  const inputStyle =
    orientation === "column"
      ? {
          width: "100%",
          boxSizing: "border-box",
        }
      : {};

  let className = `${routeInputFormStyles.routeInputForm} `;
  className +=
    orientation === "column"
      ? routeInputFormStyles.vertical
      : routeInputFormStyles.horizontal;

  return (
    <form className={className} style={styleOverrides}>
      <div>
        <label id="starting-point-label">Starting point</label>
        <LocationInput
          locationValue={startingPointValue}
          onLocationChange={onStartingPointChange}
          ariaLabelledBy="starting-point-label"
          style={inputStyle}
        />
      </div>
      <div>
        <label id="destination-label">Destination</label>
        <LocationInput
          locationValue={destinationValue}
          onLocationChange={onDestinationChange}
          ariaLabelledBy="destination-label"
          style={inputStyle}
        />
      </div>
      <div>
        <label id="arrive-by-label">Arrive by</label>
        <DateTimeInput
          value={arriveByDateTimeValue}
          onChange={onArriveByDateTimeChange}
          style={inputStyle}
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
