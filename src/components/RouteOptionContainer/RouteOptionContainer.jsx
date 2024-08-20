import React from "react";
import { connect, useSelector } from "react-redux";
import {
  dockedEbikeDestinationStationSelected,
  dockedEbikeStartingPointStationSelected,
  routeOptionSelected,
  selectRouteOptions,
  selectSelectedRouteOptionIndex,
} from "../../modules/planatrip/planATripSlice";
import { TransportType } from "../../modules/types";
import DockedEbikeRouteOption from "../RouteOption/DockedEbikeRouteOption";

function RouteOptionContainer({ dispatch }) {
  const routeOptions = useSelector(selectRouteOptions);
  const selectedIndex = useSelector(selectSelectedRouteOptionIndex);
  return (
    <div role="listbox">
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
