import React, { useEffect } from "react";
import { connect, shallowEqual, useSelector } from "react-redux";
import {
  dockedEbikeDestinationStationSelected,
  dockedEbikeStartingPointStationSelected,
  fetchRouteOptionDetails,
  routeOptionSelected,
  selectRouteOptions,
  selectSelectedRouteOptionIndex,
  selectSelectedRouteOptionWithoutDetails,
} from "../../modules/planatrip/planATripSlice";
import { TransportType } from "../../modules/types";
import DockedEbikeRouteOption from "../RouteOption/DockedEbikeRouteOption";
import { useApolloClient } from "@apollo/client";

function RouteOptionContainer({ dispatch, style = undefined }) {
  const routeOptions = useSelector(selectRouteOptions);
  const selectedIndex = useSelector(selectSelectedRouteOptionIndex);
  const graphQLClient = useApolloClient();
  const selectedRouteOption = useSelector(
    selectSelectedRouteOptionWithoutDetails,
    shallowEqual,
  );

  useEffect(() => {
    if (selectedRouteOption !== null) {
      dispatch(
        fetchRouteOptionDetails({
          client: graphQLClient,
          routeOption: selectedRouteOption,
        }),
      );
    }
  }, [dispatch, selectedRouteOption, graphQLClient]);

  return (
    <div role="listbox" style={style}>
      {routeOptions.map((routeOption, index) =>
        (() => {
          switch (routeOption.transportType) {
            case TransportType.DOCKED_EBIKE:
              return (
                <DockedEbikeRouteOption
                  routeOption={routeOption}
                  isSelected={index === selectedIndex}
                  onClick={() => {
                    // noinspection JSCheckFunctionSignatures
                    dispatch(
                      routeOptionSelected({
                        routeOptionIndex: index,
                      }),
                    );
                  }}
                  onStartingPointStationChange={(stationId) => {
                    // noinspection JSCheckFunctionSignatures
                    dispatch(
                      dockedEbikeStartingPointStationSelected({
                        routeOptionIndex: index,
                        stationId: stationId,
                      }),
                    );
                  }}
                  onDestinationStationChange={(stationId) => {
                    // noinspection JSCheckFunctionSignatures
                    dispatch(
                      dockedEbikeDestinationStationSelected({
                        routeOptionIndex: index,
                        stationId: stationId,
                      }),
                    );
                  }}
                  key={index}
                />
              );
            default:
              throw new TypeError(
                `Unknown transport type: '${routeOption.transportType}'.`,
              );
          }
        })(),
      )}
    </div>
  );
}

export default connect()(RouteOptionContainer);
