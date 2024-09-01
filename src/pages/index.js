import * as React from "react";
import {
  arriveByDateTimeChanged,
  destinationChanged,
  selectArriveBy,
  selectDestination,
  selectStartingPoint,
  startingPointChanged,
} from "../modules/planatrip/planATripSlice";
import RouteInputForm from "../components/RouteInputForm/RouteInputForm";
import { useDispatch, useSelector } from "react-redux";
import { navigate } from "gatsby";

const IndexPage = () => {
  const dispatch = useDispatch();
  const startingPoint = useSelector(selectStartingPoint);
  const destination = useSelector(selectDestination);
  const arriveBy = useSelector(selectArriveBy);

  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
        gap: "0.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
        }}
      >
        <h1 style={{ fontSize: "2rem" }}>Micro-Commute</h1>
        <span style={{ fontSize: "1.2rem", marginLeft: "1rem" }}>
          Solving the first and last mile problem.
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
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
          orientation="row"
        />
        <button
          style={{ marginLeft: "0.5rem" }}
          onClick={() => navigate("/plan-a-trip")}
        >
          Let's Go!
        </button>
      </div>
      <p>Your local bike share options — simplified, personalized. 🌱🚴🏡</p>
    </main>
  );
};

export default IndexPage;
