import React from "react";
import PropTypes from "prop-types";
import DockedEbikeRouteOption from "./DockedEbikeRouteOption";

export default function RouteOption({type, ...props}) {
  if (type === DockedEbikeRouteOption.TYPE) {
    return DockedEbikeRouteOption(props);
  } else {
    throw TypeError(`Unknown route option type: '${type}'.`);
  }
}

RouteOption.propTypes = {
  type: PropTypes.oneOf([
    DockedEbikeRouteOption.TYPE,
  ]),
}
