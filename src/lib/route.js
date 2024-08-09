import PropTypes from "prop-types";

export const CoordinatesPropType = PropTypes.shape({
  longitude: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
});

export const DockedEbikeRoutePropType = PropTypes.shape({
  type: PropTypes.oneOf(["docked-ebike"]),
  startingPoint: CoordinatesPropType.isRequired,
  destination: CoordinatesPropType.isRequired,
  startingPointDockingStation: CoordinatesPropType.isRequired,
  destinationDockingStation: CoordinatesPropType.isRequired,
});

export const RoutePropType = PropTypes.oneOfType([
  DockedEbikeRoutePropType,
]);
