import React, { useEffect } from "react";
import RouteMap from "../components/RouteMap/RouteMap";
import RouteInputForm from "../components/RouteInputForm/RouteInputForm";
import { useApolloClient } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import {
  destinationChanged,
  fetchRouteOptions,
  selectDestination,
  selectRouteOptionsLoadingStatus,
  selectStartingPoint,
  startingPointChanged,
} from "../modules/planatrip/planATripSlice";
import RouteOptionsContainer from "../components/RouteOptionContainer/RouteOptionContainer";

export default function PlanATripPage() {
  const dispatch = useDispatch();
  const startingPoint = useSelector(selectStartingPoint);
  const destination = useSelector(selectDestination);
  const loadingStatus = useSelector(selectRouteOptionsLoadingStatus);
  const graphQLClient = useApolloClient();

  useEffect(() => {
    if (startingPoint && destination) {
      dispatch(
        fetchRouteOptions({
          client: graphQLClient,
          variables: {
            startingPoint: startingPoint,
            destination: destination,
          },
        }),
      );
    }
  }, [dispatch, startingPoint, destination, graphQLClient]);

  return (
    <main style={{ height: "100vh" }}>
      <aside style={{ width: "350px", float: "left" }}>
        <RouteInputForm
          onStartingPointChange={(location) => {
            // noinspection JSCheckFunctionSignatures
            dispatch(startingPointChanged(location));
          }}
          onDestinationChange={(location) => {
            // noinspection JSCheckFunctionSignatures
            dispatch(destinationChanged(location));
          }}
        />
        {(() => {
          switch (loadingStatus) {
            case "idle":
              return <></>;
            case "pending":
              return <span>Loading...</span>;
            case "failed":
              return <span>An error occurred</span>;
            case "succeeded":
              return <RouteOptionsContainer dispatch={dispatch} />;
            default:
              throw new TypeError(
                `Unknown loading status: '${loadingStatus}'.`,
              );
          }
        })()}
      </aside>
      <RouteMap style={{ height: "100%" }} />
    </main>
  );
}
