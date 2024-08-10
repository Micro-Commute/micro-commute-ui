import PropTypes from "prop-types";
import { CoordinatesPropType } from "./types";

/** @deprecated - use RoutePropType from types.js */
export const DockedEbikeRoutePropType = PropTypes.shape({
  type: PropTypes.oneOf(["docked-ebike"]),
  startingPoint: CoordinatesPropType.isRequired,
  destination: CoordinatesPropType.isRequired,
  startingPointDockingStation: CoordinatesPropType.isRequired,
  destinationDockingStation: CoordinatesPropType.isRequired,
});

/** @deprecated - use RoutePropType from types.js */
export const RoutePropType = PropTypes.oneOfType([DockedEbikeRoutePropType]);
