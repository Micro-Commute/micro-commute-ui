import { DateTime, Duration } from "luxon";

/** Source: https://github.com/colbyfayock/gatsby-starter-leaflet/blob/master/src/lib/util.js */
export function isDomAvailable() {
  return (
    typeof window !== "undefined" &&
    !!window.document &&
    !!window.document.createElement
  );
}

/**
 * Sums a duration to a naive date-time string and returns it as a string.
 *
 * NOTE: If the given naive date is not naive (i.e., has a timezone), then this function will
 * ignore that timezone and return a naive date-time.
 *
 * @param naiveDate {String} naive date with format YYYY-MM-DDTHH:mm:ss, e.g., "2024-09-08T15:33:34.12"
 * @param duration {String} ISO-8601 duration string, e.g., "PT0H14M0S"
 */
export function addDurationToNaiveDateTime(naiveDate, duration) {
  const durationObject = Duration.fromISO(duration);
  if (!durationObject.isValid) {
    throw new Error(
      `Invalid duration. Reason: ${durationObject.invalidReason}.`,
    );
  }

  const naiveDateObject = DateTime.fromISO(naiveDate, { zone: "UTC" });
  if (!naiveDateObject.isValid) {
    throw new Error(
      `Invalid datetime. Reason: ${naiveDateObject.invalidReason}.`,
    );
  }

  const newDateObject = naiveDateObject.plus(durationObject);
  return newDateObject.toFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
}

/**
 * Sums an array of durations formatted as ISO-8601 duration strings.
 * Returns the summed duration as an ISO-8601 formatted duration string.
 */
export function sumDurations(durations) {
  /** @type Duration */
  const totalDuration = durations.reduce((accumulatedDuration, duration) => {
    const durationObject = Duration.fromISO(duration);
    if (!durationObject.isValid) {
      throw new Error(
        `Invalid duration. Reason: ${durationObject.invalidReason()}.`,
      );
    }

    return accumulatedDuration.plus(durationObject);
  }, Duration.fromObject({}));

  return totalDuration.toISO();
}
