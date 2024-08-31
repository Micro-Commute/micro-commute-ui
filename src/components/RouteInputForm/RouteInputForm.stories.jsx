import React, { useState } from "react";
import RouteInputForm from "./RouteInputForm";
import { fn } from "@storybook/test";

export default {
  title: "Components/RouteInputForm",
  component: RouteInputForm,
  tags: ["autodocs"],
};

export const Default = {
  args: {
    startingPointValue: null,
    onStartingPointChange: fn(),
    destinationValue: null,
    onDestinationChange: fn(),
    arriveByDateTimeValue: "2023-09-10T10:00",
    onArriveByDateTimeChange: fn(),
  },
  render: function (args) {
    const [startingPointValue, setStartingPointValue] = useState(
      args.startingPointValue,
    );

    const [destinationValue, setDestinationValue] = useState(
      args.destinationValue,
    );

    const [arriveByDateTime, setArriveByDateTime] = useState(
      args.arriveByDateTimeValue,
    );

    function onStartingPointChange(location) {
      args.onStartingPointChange(location); // fn() for debugging
      setStartingPointValue(location);
    }

    function onDestinationChange(location) {
      args.onDestinationChange(location); // fn() for debugging
      setDestinationValue(location);
    }

    function onArriveByDateTimeChange(datetime) {
      args.onArriveByDateTimeChange(datetime); // fn() for debugging
      setArriveByDateTime(datetime);
    }

    return (
      <RouteInputForm
        startingPointValue={startingPointValue}
        onStartingPointChange={onStartingPointChange}
        destinationValue={destinationValue}
        onDestinationChange={onDestinationChange}
        arriveByDateTimeValue={arriveByDateTime}
        onArriveByDateTimeChange={onArriveByDateTimeChange}
      />
    );
  },
};
