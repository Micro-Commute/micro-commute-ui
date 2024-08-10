import React from "react";
import PropTypes from "prop-types";
import RouteOption from "../RouteOption/RouteOption";
import { RouteOptionPropType, RoutePropType } from "../../lib/types";

export default function RouteOptionList({
  routeOptions,
  activeRoute,
  setActiveRoute,
}) {
  function isSelected(routeOption) {
    return (
      routeOption.provider.id === activeRoute.providerId &&
      routeOption.transportType === activeRoute.transportType
    );
  }

  function selectRoute(routeOption) {
    setActiveRoute((activeRoute) => ({
      ...activeRoute,
      providerId: routeOption.provider.id,
      transportType: routeOption.transportType,
    }));
  }

  return (
    <div>
      {routeOptions.map((routeOption) => (
        <RouteOption
          routeOption={routeOption}
          isSelected={isSelected(routeOption)}
          select={() => {
            if (!isSelected(routeOption)) {
              selectRoute(routeOption);
            }
          }}
        />
      ))}
    </div>
  );
}

RouteOptionList.propTypes = {
  routeOptions: PropTypes.arrayOf(RouteOptionPropType),
  activeRoute: RoutePropType,
  setActiveRoute: PropTypes.func.isRequired,
};
