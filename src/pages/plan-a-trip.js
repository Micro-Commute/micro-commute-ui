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

// Define styles for the new section
const headingContainerSmallStyles = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center", // Vertically center items
  marginBottom: "1rem", // Margin below the heading container
};

const headingSmallStyles = {
  margin: 0,
  fontSize: "2.5vw", // Font size for the title
};

const headingAccentSmallStyles = {
  margin: 0,
  color: "#663399",
  fontSize: "1.5vw", // Smaller font size for the subtitle
  marginLeft: "1rem", // Space between the title and subtitle
};

const verticalBarStyles = {
  fontSize: "5vw", // Match the font size of the heading
  lineHeight: 1, // Adjust the line height to match the heading
  margin: "0 0.5rem", // Margin to add space around the vertical bar
  height: "100%", // Make sure it stretches to the full height
};

export default function PlanATripPage() {
  const dispatch = useDispatch();
  const startingPoint = useSelector(selectStartingPoint);
  const destination = useSelector(selectDestination);
  const arriveBy = useSelector(selectArriveBy);
  const loadingStatus = useSelector(selectRouteOptionsLoadingStatus);
  const nRouteOptions = useSelector(selectNumberOfAvailableRouteOptions);
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
    <main
      style={{
        height: "100vh",
        border: "2px solid #fff",
        padding: "1rem",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <aside style={{ width: "24rem", marginRight: "1rem" }}>
        <div style={headingContainerSmallStyles}>
          <h1 style={headingSmallStyles}>Micro-Commute</h1>
          <span style={verticalBarStyles}>|</span>
          <span style={headingAccentSmallStyles}>
            Solving the first and last mile problem.
          </span>
        </div>

        <RouteInputForm
          startingPointValue={startingPoint}
          onStartingPointChange={(location) => {
            dispatch(startingPointChanged(location));
          }}
          destinationValue={destination}
          onDestinationChange={(location) => {
            dispatch(destinationChanged(location));
          }}
          arriveByDateTimeValue={arriveBy}
          onArriveByDateTimeChange={(dateTime) => {
            dispatch(arriveByDateTimeChanged(dateTime));
          }}
          orientation={"column"}
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
      <RouteMap style={{ flex: 1 }} /> {/* Use flex to fill remaining space */}
    </main>
  );
}
