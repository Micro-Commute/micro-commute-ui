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
