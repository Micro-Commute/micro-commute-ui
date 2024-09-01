import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import {
  GET_DOCKED_EBIKE_ROUTE_OPTION_DETAILS_QUERY,
  LIST_ROUTE_OPTIONS_QUERY,
} from "./graphql";
import { TransportType } from "../types";
import { ApolloClient } from "@apollo/client";
import { addDurationToNaiveDateTime, sumDurations } from "../util";
import { DateTime as LuxonDateTime, Duration as LuxonDuration } from "luxon";

//////////////////////////////////
// State JSDoc type definitions //
//////////////////////////////////

/**
 * @typedef {object} PlanATripState
 * @property {Location|null} startingPoint
 * @property {Location|null} destination
 * @property {DateTime|null} arriveBy
 * @property {Object.<string, Provider>} providers
 * @property {RouteOptionState} routeOptions
 */

/**
 * @typedef {object} Location
 * @property {string} address
 * @property {Coordinates} coordinates
 */

/**
 * @typedef {string} DateTime
 * Example: "2024-08-24T12:10"
 */

/**
 * @typedef {string} Duration
 * Example: "PT0H30M5S" (= 0 hours, 30 minutes, 5 seconds)
 */

/**
 * @typedef {object} Coordinates
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 * @typedef {object} Provider
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {"idle"|"pending"|"succeeded"|"failed"} RouteOptionLoadingStatus
 */

/**
 * @typedef {object} RouteOptionState
 * @property {RouteOptionLoadingStatus} loading
 * @property {string|null} error
 * @property {DockedEBikeRouteOption} entities
 * @property {int} selectedEntityIndex
 */

/**
 * @typedef GeoJSONFeatureCollection
 */

/**
 * @typedef {object} DockedEBikeRouteOptionDetails
 * @property {DateTime} leaveAt
 * @property {DateTime} arriveAt
 * @property {DateTime} takeBikeAt
 * @property {DateTime} parkBikeAt
 * @property {Duration} travelTimeTotal
 * @property {Duration} walkingTimeFromStartingPoint
 * @property {Duration} cyclingTimeStationToStation
 * @property {Duration} walkingTimeToDestination
 * @property {GeoJSONFeatureCollection} featureCollection
 */

/**
 * @typedef {"idle"|"pending"|"succeeded"|"failed"} RouteOptionDetailsLoadingStatus
 */

/**
 * @typedef {object} DockedEBikeRouteOption
 * @property {string} providerId
 * @property {TransportType.DOCKED_EBIKE} transportType
 * @property {{startingPoint:DockingStation[],destination:DockingStation[]}} nearByStations
 * @property {{startingPoint:string|null,destination:string|null}} selectedStationIds
 * @property {DockedEBikeRouteOptionDetails|null} details
 * @property {RouteOptionDetailsLoadingStatus} loading
 * @property {string|null} error
 */

/**
 * @typedef {object} DockingStation
 * @property {string} id
 * @property {string} name
 * @property {Coordinates} coordinates
 */

///////////////////////
// Redux state slice //
///////////////////////

function getInitialState() {
  return {
    startingPoint: null,
    destination: null,
    arriveBy: nextMondayAt9AM(),
    providers: [],
    routeOptions: {
      loading: "idle",
      error: null,
      entities: [],
      selectedEntityIndex: -1,
    },
  };
}

function nextMondayAt9AM() {
  const startOfWeek = LuxonDateTime.now().startOf("week");
  const delta = LuxonDuration.fromObject({ days: 7, hours: 9 });
  const nextMonday = startOfWeek.plus(delta);
  return nextMonday.toFormat("yyyy-MM-dd'T'HH:mm");
}

export const planATripSlice = createSlice({
  name: "planATrip",
  initialState: getInitialState,
  reducers: {
    /**
     * @param {PlanATripState} state
     * @param {{payload: Location}} action
     */
    startingPointChanged: (state, action) => {
      state.startingPoint = action.payload;
    },
    /**
     * @param {PlanATripState} state
     * @param {{payload: Location}} action
     */
    destinationChanged: (state, action) => {
      state.destination = action.payload;
    },
    /**
     * @param {PlanATripState} state
     * @param {{payload: DateTime}} action
     */
    arriveByDateTimeChanged: (state, action) => {
      state.arriveBy = action.payload;
    },
    /**
     * @param {PlanATripState} state
     * @param {{payload: {routeOptionIndex: int}}} action
     */
    routeOptionSelected: (state, action) => {
      state.routeOptions.selectedEntityIndex = action.payload.routeOptionIndex;
    },
    /**
     * @param {PlanATripState} state
     * @param {{payload:{routeOptionIndex:int,stationId:string}}} action
     */
    dockedEbikeStartingPointStationSelected: (state, action) => {
      const index = action.payload.routeOptionIndex;
      const routeOption = state.routeOptions.entities[index];
      if (routeOption.transportType === TransportType.DOCKED_EBIKE) {
        routeOption.selectedStationIds.startingPoint = action.payload.stationId;
      } else {
        throw new TypeError(
          `Expected ${TransportType.DOCKED_EBIKE}, got ${routeOption.transportType}.`,
        );
      }
    },
    /**
     * @param {PlanATripState} state
     * @param {{payload:{routeOptionIndex:int,stationId:string}}} action
     */
    dockedEbikeDestinationStationSelected: (state, action) => {
      const index = action.payload.routeOptionIndex;
      const routeOption = state.routeOptions.entities[index];
      if (routeOption.transportType === TransportType.DOCKED_EBIKE) {
        routeOption.selectedStationIds.destination = action.payload.stationId;
      } else {
        throw new TypeError(
          `Expected ${TransportType.DOCKED_EBIKE}, got ${routeOption.transportType}.`,
        );
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch route options reducers
    builder.addCase(fetchRouteOptions.pending, (state, action) => {
      state.routeOptions.loading = "pending";
    });
    builder.addCase(fetchRouteOptions.fulfilled, (state, action) => {
      state.providers = mapProvidersFromGraphQl(action.payload.data);
      state.routeOptions.entities = mapRouteOptionsFromGraphQl(
        action.payload.data,
      );
      state.routeOptions.selectedEntityIndex =
        state.routeOptions.entities.length > 0 ? 0 : -1;
      state.routeOptions.loading = "succeeded";
    });
    builder.addCase(fetchRouteOptions.rejected, (state, action) => {
      state.routeOptions.loading = "failed";
      state.routeOptions.error = action["error"]["message"];
    });
    // Fetch route option details reducers
    builder.addCase(fetchRouteOptionDetails.pending, (state, action) => {
      const index = state.routeOptions.selectedEntityIndex;
      const routeOption = state.routeOptions.entities[index];
      routeOption.loading = "pending";
    });
    builder.addCase(fetchRouteOptionDetails.fulfilled, (state, action) => {
      const index = state.routeOptions.selectedEntityIndex;
      const routeOption = state.routeOptions.entities[index];
      routeOption.details = mapDockedEbikeRouteOptionDetailsFromGraphQl(
        action.payload.data,
      );
      routeOption.loading = "succeeded";
    });
    builder.addCase(fetchRouteOptionDetails.rejected, (state, action) => {
      const index = state.routeOptions.selectedEntityIndex;
      const routeOption = state.routeOptions.entities[index];
      routeOption.loading = "failed";
      routeOption.error = action["error"]["message"];
    });
  },
  selectors: {
    /**
     * @param {PlanATripState} state
     * @returns {Location|null}
     */
    selectStartingPoint: (state) => state.startingPoint,
    /**
     * @param {PlanATripState} state
     * @returns {Location|null}
     */
    selectDestination: (state) => state.destination,
    /**
     * @param {PlanATripState} state
     * @returns {DateTime|null}
     */
    selectArriveBy: (state) => state.arriveBy,
    /**
     * @param {PlanATripState} state
     * @returns {RouteOptionLoadingStatus}
     */
    selectRouteOptionsLoadingStatus: (state) => state.routeOptions.loading,
    /**
     * @param {PlanATripState} state
     * @return {number}
     */
    selectNumberOfAvailableRouteOptions: (state) =>
      state.routeOptions.entities.length,
    /**
     * @param {PlanATripState} state
     * @return {int}
     */
    selectSelectedRouteOptionIndex: (state) =>
      state.routeOptions.selectedEntityIndex,
    /**
     * NOTE: This selector creates a new object on every call.
     * Use 'shallowEqual' to avoid unnecessary re-renders.
     *
     * @param {PlanATripState} state
     * @return {DockedEBikeRouteOptionDTO|null}
     */
    selectSelectedRouteOption: (state) => {
      const index = state.routeOptions.selectedEntityIndex;
      if (index < 0) {
        return null;
      }
      const entity = state.routeOptions.entities[index];
      return mapRouteOptionForSelect(state.providers, entity);
    },
  },
});

/////////////
// Reducer //
/////////////

export default planATripSlice.reducer;

/////////////
// Actions //
/////////////

export const {
  /**
   * @param {{payload: Location}} action
   */
  startingPointChanged,
  /**
   * @param {{payload: Location}} action
   */
  destinationChanged,
  /**
   * @param {{payload: DateTime}} action
   */
  arriveByDateTimeChanged,
  /**
   * @param {{payload:{routeOptionIndex:int}}} action
   */
  routeOptionSelected,
  /**
   * @param {{payload:{routeOptionIndex:int,stationId:string}}} action
   */
  dockedEbikeStartingPointStationSelected,
  /**
   * @param {{payload:{routeOptionIndex:int,stationId:string}}} action
   */
  dockedEbikeDestinationStationSelected,
} = planATripSlice.actions;

export const fetchRouteOptions = createAsyncThunk(
  `${planATripSlice.name}/fetchRouteOptions`,
  /**
   * @param action {{client: ApolloClient, variables: {startingPoint: Location, destination: Location}}}
   */
  async ({ client, variables }) => {
    const { startingPoint, destination } = variables;
    return client.query({
      query: LIST_ROUTE_OPTIONS_QUERY,
      variables: {
        startingPointLongitude: startingPoint.coordinates.longitude,
        startingPointLatitude: startingPoint.coordinates.latitude,
        destinationLongitude: destination.coordinates.longitude,
        destinationLatitude: destination.coordinates.latitude,
      },
    });
  },
);

export const fetchRouteOptionDetails = createAsyncThunk(
  `${planATripSlice.name}/fetchRouteOptionDetails`,
  /**
   * @param action {{client: ApolloClient, routeOption: DockedEBikeRouteOptionDTO}}
   * @param thunkAPI
   */
  async ({ client, routeOption }, thunkAPI) => {
    const state = thunkAPI.getState();
    const startingPoint = selectStartingPoint(state);
    const destination = selectDestination(state);
    const arriveBy = selectArriveBy(state);
    switch (routeOption.transportType) {
      case TransportType.DOCKED_EBIKE:
        return await fetchDockedEbikeRouteOptionDetails({
          client: client,
          routeOption: routeOption,
          variables: {
            startingPoint: startingPoint,
            destination: destination,
            arriveBy: arriveBy,
          },
        });
      default:
        throw new TypeError(
          `Unknown transport type: '${routeOption.transportType}'.`,
        );
    }
  },
);

/**
 * @param action {{
 *    client: ApolloClient,
 *    routeOption: DockedEBikeRouteOptionDTO,
 *    variables: {
 *      startingPoint: Location,
 *      destination: Location,
 *      arriveBy: DateTime,
 *    }
 * }}
 */
async function fetchDockedEbikeRouteOptionDetails({
  client,
  routeOption,
  variables,
}) {
  return client.query({
    query: GET_DOCKED_EBIKE_ROUTE_OPTION_DETAILS_QUERY,
    variables: {
      providerId: routeOption.provider.id,
      startingPoint: variables.startingPoint.coordinates,
      destination: variables.destination.coordinates,
      arriveBy: variables.arriveBy,
      fromDockingStationId: routeOption.selectedStationIds.startingPoint,
      toDockingStationId: routeOption.selectedStationIds.destination,
    },
  });
}

///////////////
// Selectors //
///////////////

/**
 * @typedef {object} DockedEBikeRouteOptionDTO
 * @property {Provider} provider
 * @property {TransportType.DOCKED_EBIKE} transportType
 * @property {{startingPoint:DockingStation[],destination:DockingStation[]}} nearByStations
 * @property {{startingPoint:string|null,destination:string|null}} selectedStationIds
 * @property {DockedEBikeRouteOptionDetails|null} details
 * @property {RouteOptionDetailsLoadingStatus} loading
 * @property {string|null} error
 */

/**
 * @param {{planATrip: PlanATripState}}
 * @returns DockedEBikeRouteOptionDTO[]
 */
export const selectRouteOptions = createSelector(
  [
    ({ planATrip }) => planATrip.providers,
    ({ planATrip }) => planATrip.routeOptions.entities,
  ],
  (providers, entities) =>
    entities.map((entity) => mapRouteOptionForSelect(providers, entity)),
);

/**
 * This selector is a bit hacky; it returns the selected route excluding the
 * route details, which it assumes to be 'details', 'loading', and 'error',
 * and which it sets to 'undefined' before returning.
 *
 * We introduced this selector as a quick way to depend on the "metadata" of
 * the currently selected route option, without depending on its details. This
 * allows us to create an effect to send out a request to the backend and get
 * route option details without it entering an infinite loop.
 *
 * NOTE: This selector creates a new object on every call. Use 'shallowEqual'
 * to avoid unnecessary re-renders.
 *
 * @param {{planATrip: PlanATripState}} state
 * @return {DockedEBikeRouteOptionDTO|null}
 */
export function selectSelectedRouteOptionWithoutDetails(state) {
  // noinspection JSCheckFunctionSignatures
  const routeOption = selectSelectedRouteOption(state);
  if (routeOption !== null) {
    routeOption.details = undefined;
    routeOption.loading = undefined;
    routeOption.error = undefined;
  }
  return routeOption;
}

export const {
  selectStartingPoint,
  selectDestination,
  selectArriveBy,
  selectNumberOfAvailableRouteOptions,
  selectRouteOptionsLoadingStatus,
  selectSelectedRouteOption,
  selectSelectedRouteOptionIndex,
} = planATripSlice.selectors;

///////////////
// Internals //
///////////////

/** Maps providers from `LIST_ROUTE_OPTIONS_QUERY` response to redux state. */
function mapProvidersFromGraphQl({ listRouteOptions }) {
  return listRouteOptions.reduce((providers, { provider }) => {
    return {
      ...providers,
      [provider.id]: {
        id: provider.id,
        name: provider.name,
      },
    };
  }, {});
}

/** Maps route options from `LIST_ROUTE_OPTIONS_QUERY` response to redux state. */
function mapRouteOptionsFromGraphQl({ listRouteOptions }) {
  return listRouteOptions.map(({ __typename, ...rest }) => {
    if (__typename === "DockedEBikeRouteOption") {
      return mapDockedEbikeRouteOptionFromGraphQl(rest);
    }
    throw new TypeError(`Unknown route option typename: ${__typename}.`);
  });
}

/** Maps docked ebike route option from `LIST_ROUTE_OPTIONS_QUERY` response to redux state. */
function mapDockedEbikeRouteOptionFromGraphQl(data) {
  const mapStation = ({ id, name, location }) => ({
    id: id,
    name: name,
    coordinates: {
      latitude: location.latitude,
      longitude: location.longitude,
    },
  });
  return {
    providerId: data.provider.id,
    transportType: TransportType.DOCKED_EBIKE,
    nearByStations: {
      startingPoint: data.fromDockingStations.map(mapStation),
      destination: data.toDockingStations.map(mapStation),
    },
    selectedStationIds: {
      startingPoint:
        data.fromDockingStations.length > 0
          ? data.fromDockingStations[0].id
          : null,
      destination:
        data.toDockingStations.length > 0 ? data.toDockingStations[0].id : null,
    },
    details: null,
    loading: "idle",
    error: null,
  };
}

/**
 * @param {Object.<string, Provider>} providers
 * @param {DockedEBikeRouteOption} entity
 */
function mapRouteOptionForSelect(providers, entity) {
  const mapDockedEbike = (entity) => ({
    provider: providers[entity.providerId],
    transportType: entity.transportType,
    nearByStations: entity.nearByStations,
    selectedStationIds: entity.selectedStationIds,
    details: entity.details,
    loading: entity.loading,
    error: entity.error,
  });
  switch (entity.transportType) {
    case TransportType.DOCKED_EBIKE:
      return mapDockedEbike(entity);
    default:
      throw new TypeError(`Unknown transport type: '${entity.transportType}'.`);
  }
}

/** Maps docked ebike route option details from `GET_DOCKED_EBIKE_ROUTE_OPTION_DETAILS_QUERY` response to redux state. */
function mapDockedEbikeRouteOptionDetailsFromGraphQl(data) {
  const details = data["getDockedEbikeRouteOptionDetails"];
  if (details.__typename !== "DockedEbikeRouteOptionDetails") {
    throw new TypeError(`Unexpected type: ${details.__typename}.`);
  }

  const usualAvAtPickup = details.usualAvailabilityAtBikePickupStation;
  const usualAvAtDropOff = details.usualAvailabilityAtBikeDropOffStation;

  const totalTravelTime = sumDurations([
    details.walkingTimeFromStartingPoint,
    details.cyclingTimeStationToStation,
    details.walkingTimeToDestination,
  ]);

  return {
    leaveAt: details.leaveAt,
    takeBikeAt: details.takeBikeAt,
    parkBikeAt: details.parkBikeAt,
    arriveAt: addDurationToNaiveDateTime(details.leaveAt, totalTravelTime),
    travelTimeTotal: totalTravelTime,
    walkingTimeFromStartingPoint: details.walkingTimeFromStartingPoint,
    cyclingTimeStationToStation: details.cyclingTimeStationToStation,
    walkingTimeToDestination: details.walkingTimeToDestination,
    usualAvailabilityAtBikePickupStation: {
      standardBikes: usualAvAtPickup.standardBikes,
      electricBikes: usualAvAtPickup.electricBikes,
      emptyDocks: usualAvAtPickup.emptyDocks,
    },
    usualAvailabilityAtBikeDropOffStation: {
      standardBikes: usualAvAtDropOff.standardBikes,
      electricBikes: usualAvAtDropOff.electricBikes,
      emptyDocks: usualAvAtDropOff.emptyDocks,
    },
    featureCollection: JSON.parse(details.featureCollection),
  };
}
