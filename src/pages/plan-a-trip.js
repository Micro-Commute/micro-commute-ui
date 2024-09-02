import React, { useEffect } from "react";
import RouteMap from "../components/RouteMap/RouteMap";
import RouteInputForm from "../components/RouteInputForm/RouteInputForm";
import { useApolloClient } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import {
  arriveByDateTimeChanged,
  destinationChanged,
  fetchRouteOptions,
  selectArriveBy,
  selectDestination,
  selectNumberOfAvailableRouteOptions,
  selectRouteOptionsLoadingStatus,
  selectStartingPoint,
  startingPointChanged,
} from "../modules/planatrip/planATripSlice";
import RouteOptionsContainer from "../components/RouteOptionContainer/RouteOptionContainer";

export default function PlanATripPage() {
  const dispatch = useDispatch();
  const startingPoint = useSelector(selectStartingPoint);
  const destination = useSelector(selectDestination);
  const arriveBy = useSelector(selectArriveBy);
  const loadingStatus = useSelector(selectRouteOptionsLoadingStatus);
  const nRouteOptions = useSelector(selectNumberOfAvailableRouteOptions);
  const graphQLClient = useApolloClient();

  useEffect(() => {
    if (startingPoint && destination && arriveBy) {
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
  }, [dispatch, startingPoint, destination, arriveBy, graphQLClient]);

  return (
    <main style={{ height: "100vh" }}>
      <aside style={{ width: "575px", float: "left" }}>
        <RouteInputForm
          startingPointValue={startingPoint}
          onStartingPointChange={(location) => {
            // noinspection JSCheckFunctionSignatures
            dispatch(startingPointChanged(location));
          }}
          destinationValue={destination}
          onDestinationChange={(location) => {
            // noinspection JSCheckFunctionSignatures
            dispatch(destinationChanged(location));
          }}
          arriveByDateTimeValue={arriveBy}
          onArriveByDateTimeChange={(dateTime) => {
            // noinspection JSCheckFunctionSignatures
            dispatch(arriveByDateTimeChanged(dateTime));
          }}
          orientation="column"
          styleOverrides={{ marginBottom: "1rem" }}
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
              return nRouteOptions > 0 ? (
                <RouteOptionsContainer dispatch={dispatch} />
              ) : (
                <span>No route options</span>
              );
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
