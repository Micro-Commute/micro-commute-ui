import React from "react";
import PropTypes from "prop-types";
import { formatDurationToHumanReadableWithMinutePrecision } from "../../modules/util";

export default function DockedEbikeRouteOptionDetails({ routeOption }) {
  const {
    leaveAt,
    arriveAt,
    takeBikeAt,
    parkBikeAt,
    travelTimeTotal,
    walkingTimeFromStartingPoint,
    cyclingTimeStationToStation,
    walkingTimeToDestination,
    usualAvailabilityAtBikePickupStation,
    usualAvailabilityAtBikeDropOffStation,
  } = routeOption.details;
  return (
    <div
      style={{
        marginTop: "16px",
        borderTop: "1px solid #ccc",
        paddingTop: "16px",
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr 1fr",
        gridGap: "16px",
      }}
    >
      {/* Column 1 */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <div>Departure and arrival times</div>
          <div>{`${formatTimestamp(leaveAt)} – ${formatTimestamp(arriveAt)}`}</div>
        </div>
        <div
          style={{
            marginTop: "8px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ textAlign: "center" }}>
              <div>🧍</div>
              <div>
                {formatDurationToHumanReadableWithMinutePrecision(
                  walkingTimeFromStartingPoint,
                )}
              </div>
            </div>
            <div style={{ margin: "0 8px" }}>{">"}</div>
            <div style={{ textAlign: "center" }}>
              <div>🚴</div>
              <div>
                {formatDurationToHumanReadableWithMinutePrecision(
                  cyclingTimeStationToStation,
                )}
              </div>
            </div>
            <div style={{ margin: "0 8px" }}>{">"}</div>
            <div style={{ textAlign: "center" }}>
              <div>🧍</div>
              <div>
                {formatDurationToHumanReadableWithMinutePrecision(
                  walkingTimeToDestination,
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Column 2 */}
      <div>
        <div>
          <div>Total travel time</div>
          <div>
            {formatDurationToHumanReadableWithMinutePrecision(travelTimeTotal)}
          </div>
        </div>
      </div>

      {/* Column 3 */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>
          <div>Take bike at</div>
          <div>{formatTimestamp(takeBikeAt)}</div>
        </div>
        <div style={{ marginTop: "8px" }}>
          <div>Park bike at</div>
          <div>{formatTimestamp(parkBikeAt)}</div>
        </div>
      </div>

      {/* Column 4 */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <UsualAvailabilityDetails
          label="(e-)bikes"
          // NOTE: We are showing the availability of ALL bikes, not only e-bikes.
          // This effectively converts the DockedEbikeRouteOption in a hybrid (standard/e-) route option.
          // This is OK with regard to the UI because at no point do we mention that it is e-bikes only.
          // We should refactor this code at some point and build in a proper way to handle bikes vs e-bikes.
          n={
            usualAvailabilityAtBikePickupStation
              ? usualAvailabilityAtBikePickupStation.standardBikes +
                usualAvailabilityAtBikePickupStation.electricBikes
              : 0
          }
          availability={usualAvailabilityAtBikePickupStation}
        />
        <UsualAvailabilityDetails
          label="empty docks"
          n={
            usualAvailabilityAtBikeDropOffStation
              ? usualAvailabilityAtBikeDropOffStation.emptyDocks
              : 0
          }
          availability={usualAvailabilityAtBikeDropOffStation}
        />
      </div>
    </div>
  );
}

DockedEbikeRouteOptionDetails.propTypes = {
  routeOption: PropTypes.shape({
    details: PropTypes.shape({
      leaveAt: PropTypes.string.isRequired,
      arriveAt: PropTypes.string.isRequired,
      takeBikeAt: PropTypes.string.isRequired,
      parkBikeAt: PropTypes.string.isRequired,
      travelTimeTotal: PropTypes.string.isRequired,
      walkingTimeFromStartingPoint: PropTypes.string.isRequired,
      cyclingTimeStationToStation: PropTypes.string.isRequired,
      walkingTimeToDestination: PropTypes.string.isRequired,
      usualAvailabilityAtBikePickupStation: PropTypes.shape({
        standardBikes: PropTypes.number.isRequired,
        electricBikes: PropTypes.number.isRequired,
        emptyDocks: PropTypes.number.isRequired,
      }),
      usualAvailabilityAtBikeDropOffStation: PropTypes.shape({
        standardBikes: PropTypes.number.isRequired,
        electricBikes: PropTypes.number.isRequired,
        emptyDocks: PropTypes.number.isRequired,
      }),
    }).isRequired,
  }).isRequired,
};

function UsualAvailabilityDetails({ n, label, availability }) {
  return (
    <div style={{ marginTop: "8px" }}>
      <div>Usual availability</div>
      {availability && availability.totalDocks > 0 ? (
        <div>
          {`${n} / ${availability.totalDocks} ${label} `}
          <span style={{ color: getColorBasedOnAvailability(n) }}>●</span>
        </div>
      ) : (
        <span>No data</span>
      )}
    </div>
  );
}

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

const SemaphoreThresholds = {
  RED: 5, // Show red semaphore if amount less than this
  ORANGE: 15, // Show orange semaphore if amount > red and < orange; otherwise green
};

function getColorBasedOnAvailability(n) {
  if (n < SemaphoreThresholds.RED) {
    return "red";
  }
  if (n < SemaphoreThresholds.ORANGE) {
    return "orange";
  }
  return "green";
}
