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
});

export const CoordinatesPropType = PropTypes.shape({
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
});
