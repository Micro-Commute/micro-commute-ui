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
    onStartingPointChange: fn(),
    onDestinationChange: fn(),
    onArriveByDateTimeChange: fn(),
    arriveByDateTimeValue: "2023-09-10T10:00",
  },
  render: function (args) {
    const [arriveByDateTime, setArriveByDateTime] = useState(
      args.arriveByDateTimeValue,
    );

    function onArriveByDateTimeChange(datetime) {
      args.onArriveByDateTimeChange(datetime); // fn()
      setArriveByDateTime(datetime);
    }

    return (
      <RouteInputForm
        onStartingPointChange={args.onStartingPointChange}
        onDestinationChange={args.onDestinationChange}
        onArriveByDateTimeChange={onArriveByDateTimeChange}
        arriveByDateTimeValue={arriveByDateTime}
      />
    );
  },
};
