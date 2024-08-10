import PropTypes from "prop-types";

export const TransportType = Object.freeze({
  DOCKED_EBIKE: "docked-ebike",
});

export const TransportTypePropType = PropTypes.oneOf(
  Object.values(TransportType),
);

export const RouteOptionPropType = PropTypes.shape({
  provider: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }),
  transportType: TransportTypePropType,
  extraProperties: PropTypes.object.isRequired,
});

export const CoordinatesPropType = PropTypes.shape({
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
});

export const RoutePropType = PropTypes.shape({
  providerId: PropTypes.string.isRequired,
  transportType: PropTypes.string.isRequired,
  startingPoint: CoordinatesPropType.isRequired,
  destination: CoordinatesPropType.isRequired,
  extraProperties: PropTypes.object.isRequired,
});
