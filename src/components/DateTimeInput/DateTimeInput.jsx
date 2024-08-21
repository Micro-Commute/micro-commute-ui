import React from "react";
import PropTypes from "prop-types";

const DateTimeInput = ({ value, onChange }) => {
  return (
    <div>
      <label htmlFor="arrive-by">Arrive by:</label>
      <input
        type="datetime-local"
        id="arrive-by"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

DateTimeInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DateTimeInput;

