import * as React from "react";
import RouteInputForm from "../components/RouteInputForm/RouteInputForm";
import {
  arriveByDateTimeChanged,
  destinationChanged,
  selectArriveBy,
  startingPointChanged,
} from "../modules/planatrip/planATripSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "gatsby";

const pageStyles = {
  color: "#232129",
  padding: 96,
  fontFamily: "-apple-system, Roboto, sans-serif, serif",
};
const headingStyles = {
  marginTop: 0,
  marginBottom: 64,
  maxWidth: 320,
};
const headingAccentStyles = {
  color: "#663399",
};
const paragraphStyles = {
  marginBottom: 48,
};

const IndexPage = () => {
  const dispatch = useDispatch();
  const arriveBy = useSelector(selectArriveBy);
  return (
    <main style={pageStyles}>
      <RouteInputForm
        onStartingPointChange={(location) => {
          // noinspection JSCheckFunctionSignatures
          dispatch(startingPointChanged(location));
        }}
        onDestinationChange={(location) => {
          // noinspection JSCheckFunctionSignatures
          dispatch(destinationChanged(location));
        }}
        onArriveByDateTimeChange={(dateTime) => {
          // noinspection JSCheckFunctionSignatures
          dispatch(arriveByDateTimeChanged(dateTime));
        }}
        arriveByDateTimeValue={arriveBy}
        orientation="row"
      />
      <Link to="/plan-a-trip">Plan a trip</Link>
    </main>
  );
};

export default IndexPage;

export const Head = () => <title>Micro-Commute</title>;
