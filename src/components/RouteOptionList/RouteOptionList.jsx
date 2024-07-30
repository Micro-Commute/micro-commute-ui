import React from "react";
import PropTypes from "prop-types";
import RouteOption from "../RouteOption/RouteOption";

export default function RouteOptionList({routeOptionProps}) {
  return (
    <div>
      {routeOptionProps.map(props => RouteOption(props))}
    </div>
  );
}

RouteOptionList.propTypes = {
  routeOptionProps: PropTypes.arrayOf(RouteOption.propTypes),
}
