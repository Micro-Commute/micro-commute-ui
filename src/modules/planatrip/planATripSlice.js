import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { LIST_ROUTE_OPTIONS_QUERY } from "./graphql";
import { TransportType } from "../types";

//////////////////////////////////
// State JSDoc type definitions //
//////////////////////////////////

/**
 * @typedef {object} PlanATripState
 * @property {Location|null} startingPoint
 * @property {Location|null} destination
 * @property {Object.<string, Provider>} providers
 * @property {RouteOptionState} routeOptions
 */

/**
 * @typedef {object} Location
 * @property {string} address
 * @property {Coordinates} coordinates
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
 * @typedef {object} DockedEBikeRouteOption
 * @property {string} providerId
 * @property {TransportType.DOCKED_EBIKE} transportType
 * @property {{startingPoint:DockingStation[],destination:DockingStation[]}} nearByStations
 * @property {{startingPoint:string|null,destination:string|null}} selectedStationIds
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

export const planATripSlice = createSlice({
  name: "planATrip",
  initialState: {
    startingPoint: null,
    destination: null,
    providers: [],
    routeOptions: {
      loading: "idle",
      error: null,
      entities: [],
      selectedEntityIndex: -1,
    },
  },
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

///////////////
// Selectors //
///////////////

/**
 * @typedef {object} DockedEBikeRouteOptionDTO
 * @property {Provider} provider
 * @property {TransportType.DOCKED_EBIKE} transportType
 * @property {{startingPoint:DockingStation[],destination:DockingStation[]}} nearByStations
 * @property {{startingPoint:string|null,destination:string|null}} selectedStationIds
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

export const {
  selectStartingPoint,
  selectDestination,
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
  });
  switch (entity.transportType) {
    case TransportType.DOCKED_EBIKE:
      return mapDockedEbike(entity);
    default:
      throw new TypeError(`Unknown transport type: '${entity.transportType}'.`);
  }
}
