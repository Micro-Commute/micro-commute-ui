import React from "react"
import RouteMap from "../components/RouteMap/RouteMap";
import RouteInputForm from "../components/RouteInputForm/RouteInputForm";
import RouteOptionList from "../components/RouteOptionList/RouteOptionList";
import {fn} from "@storybook/test";
import {Default as RouteOptionListStory} from "../components/RouteOptionList/RouteOptionList.stories";
import {DockedEbike as RouteMapStory} from "../components/RouteMap/RouteMap.stories";

export default function PlanARoutePage() {
  return (
    <main style={{ height: "100vh"}}>
      <aside style={{width: "350px", float: "left"}}>
        <RouteInputForm onStartingPointChange={fn()} onDestinationChange={fn()}/>
        <RouteOptionList routeOptionProps={RouteOptionListStory.args.routeOptionProps} />
      </aside>
      <RouteMap style={{ height: "100%" }} route={RouteMapStory.args.route}/>
    </main>
  )
};
