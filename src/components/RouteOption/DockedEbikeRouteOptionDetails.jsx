import React from "react";
import PropTypes from "prop-types";
import { formatDurationToHumanReadableWithMinutePrecision } from "../../modules/util";
import * as styles from "./DockedEbikeRouteOption.module.css";

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

  // Source: grid layout generated with https://cssgrid-generator.netlify.app/
  return (
    <div
      style={{
        display: "grid",
        padding: "0.15rem 0 0.25rem 0.33rem",
        gridTemplateColumns: "0.90fr 0.65fr 0.5fr 0.8fr",
        gridTemplateRows: "repeat(2, 1fr)",
        gridColumnGap: "0px",
        gridRowGap: "0.75em",
      }}
    >
      {/* Column 0 */}
      <div style={{ gridArea: "1 / 1 / 2 / 2" }}>
        <div className={styles.label}>Departure and arrival times</div>
        <div>
          <strong>{`${formatTimestamp(leaveAt)} – ${formatTimestamp(arriveAt)}`}</strong>
        </div>
      </div>
      <div
        style={{
          gridArea: "2 / 1 / 3 / 2",
          paddingLeft: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <div style={{ textAlign: "center" }}>
            <div>🧍</div>
            <div className={styles.travelTimeBreakDownLabelContainer}>
              {formatDurationToHumanReadableWithMinutePrecision(
                walkingTimeFromStartingPoint,
              )}
            </div>
          </div>
          <div>{">"}</div>
          <div style={{ textAlign: "center" }}>
            <div>🚴</div>
            <div className={styles.travelTimeBreakDownLabelContainer}>
              {formatDurationToHumanReadableWithMinutePrecision(
                cyclingTimeStationToStation,
              )}
            </div>
          </div>
          <div>{">"}</div>
          <div style={{ textAlign: "center" }}>
            <div>🧍</div>
            <div className={styles.travelTimeBreakDownLabelContainer}>
              {formatDurationToHumanReadableWithMinutePrecision(
                walkingTimeToDestination,
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Column 1 */}
      <div style={{ gridArea: "1 / 2 / 2 / 3", textAlign: "center" }}>
        <div className={styles.label}>Total travel time</div>
        <div>
          <strong>
            {formatDurationToHumanReadableWithMinutePrecision(travelTimeTotal)}
          </strong>
        </div>
      </div>

      {/* Column 2 */}
      <div style={{ gridArea: "1 / 3 / 2 / 4", textAlign: "center" }}>
        <div className={styles.label}>Take bike at</div>
        <div>
          <strong>{formatTimestamp(takeBikeAt)}</strong>
        </div>
      </div>

      <div style={{ gridArea: "2 / 3 / 3 / 4", textAlign: "center" }}>
        <div className={styles.label}>Park bike at</div>
        <div>
          <strong>{formatTimestamp(parkBikeAt)}</strong>
        </div>
      </div>

      {/* Column 4 */}
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
        style={{ gridArea: "1 / 4 / 2 / 5", textAlign: "center" }}
      />
      <UsualAvailabilityDetails
        label="empty docks"
        n={
          usualAvailabilityAtBikeDropOffStation
            ? usualAvailabilityAtBikeDropOffStation.emptyDocks
            : 0
        }
        availability={usualAvailabilityAtBikeDropOffStation}
        style={{ gridArea: "2 / 4 / 3 / 5", textAlign: "center" }}
      />
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

function UsualAvailabilityDetails({ n, label, availability, style }) {
  return (
    <div style={style}>
      <div className={styles.label}>Usual availability</div>
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
