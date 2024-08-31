import * as React from "react";
import {
  arriveByDateTimeChanged,
  destinationChanged,
  fetchRouteOptions,
  selectArriveBy,
  selectDestination,
  selectStartingPoint,
  startingPointChanged,
} from "../modules/planatrip/planATripSlice";
import RouteInputForm from "../components/RouteInputForm/RouteInputForm";
import { useDispatch, useSelector } from "react-redux";
import { useApolloClient } from "@apollo/client";
import { useEffect } from "react";
import { navigate } from "gatsby";

const pageStyles = {
  color: "#232129",
  paddingTop: "20rem",
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  textAlign: "center",
};

const headingContainerStyles = {
  display: "flex",
  flexDirection: "row", // Changed to row
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap", // Allow wrapping of the tagline if necessary
  marginBottom: "3vw",
};

const headingStyles = {
  marginTop: 0,
  marginBottom: 0,
  fontSize: "5vw",
  // fontWeight: "bold", // Optional: Make the title bold
};

const headingAccentStyles = {
  color: "#663399",
  fontSize: "2vw", // Smaller font size for the tagline
  marginLeft: "1rem", // Add space between title and tagline
  whiteSpace: "normal", // Ensure tagline wraps normally
  textAlign: "left", // Align text to the left
  lineHeight: 1.4, // Adjust line height for better readability
};

const paragraphStyles = {
  marginBottom: "3vw",
  fontSize: "2vw",
};

const formContainerStyles = {
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: "1vw",
};

const buttonStyles = {
  height: "3rem",
  padding: "0 2rem",
  fontSize: "1.2vw",
  color: "#fff",
  backgroundColor: "#28a745",
  border: "none",
  borderRadius: "20px",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  cursor: "pointer",
  transition: "background-color 0.3s, transform 0.3s",
};

const buttonHoverStyles = {
  backgroundColor: "#218838",
  transform: "translateY(-2px)",
};

const IndexPage = () => {
  const dispatch = useDispatch();
  const startingPoint = useSelector(selectStartingPoint);
  const destination = useSelector(selectDestination);
  const arriveBy = useSelector(selectArriveBy);
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
    <main style={pageStyles}>
      <div style={headingContainerStyles}>
        <h1 style={headingStyles}>Micro-Commute | </h1>
        <span style={headingAccentStyles}>
          Solving the first and last mile problem.
        </span>
      </div>
      <p style={paragraphStyles}>
        Your local bike share options — simplified, personalized. 🌱🚴🏡
      </p>
      <div style={formContainerStyles}>
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
          orientation={"row"}
        />
        <button
          onClick={() => {
            navigate("/plan-a-trip");
          }}
          style={buttonStyles}
          onMouseOver={(e) => {
            Object.assign(e.target.style, buttonHoverStyles);
          }}
          onMouseOut={(e) => {
            Object.assign(e.target.style, buttonStyles);
          }}
        >
          Let's Go!
        </button>
      </div>
    </main>
  );
};

export default IndexPage;
