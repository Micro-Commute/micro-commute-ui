import React from "react";
import PropTypes from "prop-types";
import Style from "react-style-proptype";

const DateTimeInput = ({ value, onChange, style = undefined }) => {
  return (
    <div>
      <input
        type="datetime-local"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={style}
      />
    </div>
  );
};

DateTimeInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  style: Style,
};

export default DateTimeInput;
