import React from "react";
import DockedEbikeRouteOption from "./DockedEbikeRouteOption";
import { RouteOptionPropType, TransportType } from "../../lib/types";
import PropTypes from "prop-types";

export default function RouteOption({ routeOption, isSelected, select }) {
  if (routeOption.transportType === TransportType.DOCKED_EBIKE) {
    return (
      <DockedEbikeRouteOption
        routeOption={routeOption}
        isSelected={isSelected}
        onClick={() => select(routeOption)}
      />
    );
  } else {
    throw new TypeError(
      `Unknown transport type: '${routeOption.transportType}'.`,
    );
  }
}

RouteOption.propTypes = {
  routeOption: RouteOptionPropType,
  isSelected: PropTypes.bool.isRequired,
  select: PropTypes.func.isRequired, // args: (routeOption)
};
