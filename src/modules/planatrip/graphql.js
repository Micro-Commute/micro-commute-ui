import { gql } from "@apollo/client";

export const LIST_ROUTE_OPTIONS_QUERY = gql`
  query ListRouteOptions(
    $startingPointLongitude: Float!
    $startingPointLatitude: Float!
    $destinationLongitude: Float!
    $destinationLatitude: Float!
  ) {
    listRouteOptions(
      startingPointLongitude: $startingPointLongitude
      startingPointLatitude: $startingPointLatitude
      destinationLongitude: $destinationLongitude
      destinationLatitude: $destinationLatitude
    ) {
      ... on DockedEBikeRouteOption {
        provider {
          id
          name
        }
        fromDockingStations {
          id
          name
          location {
            longitude
            latitude
          }
        }
        toDockingStations {
          id
          name
          location {
            longitude
            latitude
          }
        }
      }
    }
  }
`;

export const GET_DOCKED_EBIKE_ROUTE_OPTION_DETAILS_QUERY = gql`
  query GetDockedEbikeRouteOptionDetails(
    $providerId: String!
    $startingPoint: CoordinatesInput!
    $destination: CoordinatesInput!
    $arriveBy: DateTime!
    $fromDockingStationId: String!
    $toDockingStationId: String!
  ) {
    getDockedEbikeRouteOptionDetails(
      providerId: $providerId
      startingPoint: $startingPoint
      destination: $destination
      arriveBy: $arriveBy
      fromDockingStationId: $fromDockingStationId
      toDockingStationId: $toDockingStationId
    ) {
      leaveAt
      takeBikeAt
      parkBikeAt
      walkingTimeFromStartingPoint
      cyclingTimeStationToStation
      walkingTimeToDestination
      usualAvailabilityAtBikePickupStation {
        standardBikes
        electricBikes
        emptyDocks
      }
      usualAvailabilityAtBikeDropOffStation {
        standardBikes
        electricBikes
        emptyDocks
      }
      featureCollection
    }
  }
`;
