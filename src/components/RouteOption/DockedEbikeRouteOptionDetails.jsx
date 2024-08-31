import React from "react";
import PropTypes from "prop-types";

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12 || 12;
  return `${hours}:${minutes} ${ampm}`;
}

function formatDuration(isoDuration) {
  const regex = /PT(\d+H)?(\d+M)?(\d+S)?/;
  const matches = isoDuration.match(regex);

  const hours = parseInt(matches[1]) || 0;
  const minutes = parseInt(matches[2]) || 0;
  const seconds = parseInt(matches[3]) || 0;

  const totalMinutes = hours * 60 + minutes + Math.round(seconds / 60);

  return `${totalMinutes}m`;
}

function getColorBasedOnRatio(ratio) {
  if (ratio < 0.2) return "red";
  if (ratio < 0.8) return "orange";
  return "green";
}

function DockedEbikeRouteOptionDetails({ routeOption }) {
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

  const pickupStationCapacity =
    (usualAvailabilityAtBikePickupStation?.standardBikes || 0) +
    (usualAvailabilityAtBikePickupStation?.electricBikes || 0) +
    (usualAvailabilityAtBikePickupStation?.emptyDocks || 0);

  const dropOffStationCapacity =
    (usualAvailabilityAtBikeDropOffStation?.standardBikes || 0) +
    (usualAvailabilityAtBikeDropOffStation?.electricBikes || 0) +
    (usualAvailabilityAtBikeDropOffStation?.emptyDocks || 0);

  const pickupRatio =
    (usualAvailabilityAtBikePickupStation?.standardBikes +
      usualAvailabilityAtBikePickupStation?.electricBikes) / pickupStationCapacity;

  const dropOffRatio =
    (usualAvailabilityAtBikeDropOffStation?.emptyDocks || 0) / dropOffStationCapacity;

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
              <div>{formatDuration(walkingTimeFromStartingPoint)}</div>
            </div>
            <div style={{ margin: "0 8px" }}>{">"}</div>
            <div style={{ textAlign: "center" }}>
              <div>🚴</div>
              <div>{formatDuration(cyclingTimeStationToStation)}</div>
            </div>
            <div style={{ margin: "0 8px" }}>{">"}</div>
            <div style={{ textAlign: "center" }}>
              <div>🧍</div>
              <div>{formatDuration(walkingTimeToDestination)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Column 2 */}
      <div>
        <div>
          <div>Total travel time</div>
          <div>{formatDuration(travelTimeTotal)}</div>
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
        <div>
          <div>Usual availability</div>
          <div>
            {usualAvailabilityAtBikePickupStation?.standardBikes +
              usualAvailabilityAtBikePickupStation?.electricBikes}{" "}
            / {pickupStationCapacity} bikes{" "}
            <span
              style={{
                color: getColorBasedOnRatio(pickupRatio),
              }}
            >
              ●
            </span>
          </div>
        </div>
        <div style={{ marginTop: "8px" }}>
          <div>
            Usual availability
          </div>
          <div>
            {usualAvailabilityAtBikeDropOffStation?.emptyDocks} /{" "}
            {dropOffStationCapacity} empty docks{" "}
            <span
              style={{
                color: getColorBasedOnRatio(dropOffRatio),
              }}
            >
              ●
            </span>
          </div>
        </div>
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

export default DockedEbikeRouteOptionDetails;
