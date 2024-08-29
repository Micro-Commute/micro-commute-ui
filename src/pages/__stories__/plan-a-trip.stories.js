import PlanATripPage from "../plan-a-trip";
import { LIST_ROUTE_OPTIONS_QUERY } from "../../modules/planatrip/graphql";
import { Provider } from "react-redux";
import React from "react";
import { initStore } from "../../modules/store";
import { expect, userEvent, within } from "@storybook/test";
import {
  destinationChanged,
  startingPointChanged,
} from "../../modules/planatrip/planATripSlice";

export default {
  title: "Pages/PlanATrip",
  component: PlanATripPage,
  parameters: {
    layout: "fullscreen",
    apolloClient: {
      mocks: [
        {
          request: {
            query: LIST_ROUTE_OPTIONS_QUERY,
          },
          variableMatcher: (variables) => true,
          maxUsageCount: Number.POSITIVE_INFINITY,
          delay: 500,
          /**
           * Mocked response is always empty by default.
           */
          result: {
            data: {
              listRouteOptions: [],
            },
          },
        },
      ],
    },
  },
};

export const Default = {
  decorators: [(story) => <Provider store={initStore()}>{story()}</Provider>],
};

// Redux store for 'PreLoaded' story
const preLoadedStore = initStore();

export const PreLoaded = {
  decorators: [
    (story) => <Provider store={preLoadedStore}>{story()}</Provider>,
  ],
  play: async () => {
    // noinspection JSCheckFunctionSignatures
    preLoadedStore.dispatch(
      startingPointChanged({
        // prettier-ignore
        address: "St Matthew's Church, St. Ann's Street, Westminster, Millbank, London, Greater London, England, SW1P 2BT, United Kingdom",
        coordinates: {
          latitude: 51.49708745,
          longitude: -0.13069852861405845,
        },
      }),
    );
    // noinspection JSCheckFunctionSignatures
    preLoadedStore.dispatch(
      destinationChanged({
        // prettier-ignore
        address: "Queen Mary University of London, 327, Mile End Road, Globe Town, Mile End, London Borough of Tower Hamlets, London, Greater London, England, E1 4NS, United Kingdom",
        coordinates: {
          latitude: 51.52492685,
          longitude: -0.03924405317429028,
        },
      }),
    );
  },
};

export const TestHappyPath = {
  decorators: [(story) => <Provider store={initStore()}>{story()}</Provider>],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    /******************
     * STARTING POINT *
     *****************/

    // User fills in the starting point
    await fillInStartingPoint(canvas, "St. Matthew's Church, London");

    // Micro-commute shows a list of suggested addresses for the starting point
    // Then, user scans the options and clicks the first suggested address
    await waitForLocationSuggestionsToShowAndClickFirst(canvas);

    // Micro-commute sets the input value of the starting point input to the option clicked by the user
    // Micro-commute also pans the map to the starting point and adds a marker for it
    // prettier-ignore
    const expectedStartingPointValue = (
      "St Matthew's Church, St. Ann's Street, Westminster, Millbank, " +
      "London, Greater London, England, SW1P 2BT, United Kingdom"
    );
    await expectStartingPointValue(canvas, expectedStartingPointValue);
    await expectStartingPointMapMarker(canvas, expectedStartingPointValue);

    /***************
     * DESTINATION *
     **************/

    // User types in the destination
    await fillInDestination(canvas, "Queen Mary University, London");

    // Micro-commute shows a list of suggested addresses for the destination
    // Then, user scans the options and clicks the first suggested address
    await waitForLocationSuggestionsToShowAndClickFirst(canvas);

    // Micro-commute sets the input value of the destination input to the option clicked by the user
    // prettier-ignore
    await expectDestinationValue(canvas, (
      "Queen Mary University of London, 327, Mile End Road, Globe Town, Mile End, " +
      "London Borough of Tower Hamlets, London, Greater London, England, E1 4NS, United Kingdom"
    ));

    /***************************
     * CHECK SELECTED STATIONS *
     **************************/

    // Micro-commute shows a list of one route option, Santander Cycles
    const routeOptions = await expectRouteOptions(canvas, ["Santander Cycles"]);
    const routeOpt = routeOptions[0];

    // Micro-commute pre-selects this route option for us, with the nearest docking stations pre-selected
    expect(routeOpt).toHaveAttribute("aria-selected", "true");
    await expectFromStation(routeOpt, "Abbey Orchard Street, Westminster");
    await expectToStation(routeOpt, "Clinton Road, Mile End");

    /*************************
     * SELECT OTHER STATIONS *
     ************************/

    // User selects another "from" docking station
    await setFromStation(routeOpt, "Abingdon Green, Westminster");

    // User selects another "to" docking station
    await setToStation(routeOpt, "Queen Mary's, Mile End");
  },
};

// Note: use same mocks for 'TestHappyPath' and 'PreLoaded' stories.
TestHappyPath.parameters = PreLoaded.parameters = {
  mockData: [
    {
      url: "https://nominatim.openstreetmap.org/search?q=query&format=json",
      method: "GET",
      status: 200,
      /**
       * Mock OpenStreetMap address lookup for the two locations used in the test:
       *   - St. Matthew's Church, London
       *   - Queen Mary University, London
       */
      response: ({ searchParams }) => {
        switch (searchParams.q) {
          case "St. Matthew's Church, London":
            // prettier-ignore
            return [{"place_id":275385890,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"way","osm_id":181525176,"lat":"51.49708745","lon":"-0.13069852861405845","class":"amenity","type":"place_of_worship","place_rank":30,"importance":0.27234374910307113,"addresstype":"amenity","name":"St Matthew's Church","display_name":"St Matthew's Church, St. Ann's Street, Westminster, Millbank, London, Greater London, England, SW1P 2BT, United Kingdom","boundingbox":["51.4969535","51.4972273","-0.1308778","-0.1304530"]},{"place_id":273050195,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"way","osm_id":80539455,"lat":"51.541734649999995","lon":"-0.24884195000001275","class":"amenity","type":"place_of_worship","place_rank":30,"importance":0.19050836296268334,"addresstype":"amenity","name":"St Matthew's Church","display_name":"St Matthew's Church, St Mary's Road, Harlesden, London Borough of Brent, London, Greater London, England, NW10 4AS, United Kingdom","boundingbox":["51.5415726","51.5418967","-0.2491913","-0.2484926"]},{"place_id":272778629,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"way","osm_id":184320339,"lat":"51.5251396","lon":"-0.06716921703539924","class":"amenity","type":"place_of_worship","place_rank":30,"importance":0.23859140675544002,"addresstype":"amenity","name":"Saint Matthew's Church","display_name":"Saint Matthew's Church, Saint Matthew's Row, Spitalfields, Whitechapel, London Borough of Tower Hamlets, London, Greater London, England, E2 6DT, United Kingdom","boundingbox":["51.5250353","51.5252439","-0.0674199","-0.0669185"]},{"place_id":273650991,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"node","osm_id":3020052297,"lat":"51.4603454","lon":"-0.1154828","class":"highway","type":"bus_stop","place_rank":30,"importance":9.307927061870783e-05,"addresstype":"highway","name":"St Matthew's Church","display_name":"St Matthew's Church, Effra Road, Brixton, London Borough of Lambeth, London, Greater London, England, SW2 1RP, United Kingdom","boundingbox":["51.4602954","51.4603954","-0.1155328","-0.1154328"]},{"place_id":275170894,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"node","osm_id":4601362869,"lat":"51.4597701","lon":"-0.1154646","class":"highway","type":"bus_stop","place_rank":30,"importance":9.307927061870783e-05,"addresstype":"highway","name":"St Matthew's Church","display_name":"St Matthew's Church, Effra Road, Brixton, London Borough of Lambeth, London, Greater London, England, SW2 1BX, United Kingdom","boundingbox":["51.4597201","51.4598201","-0.1155146","-0.1154146"]},{"place_id":273252218,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"node","osm_id":469781301,"lat":"51.6436902","lon":"-0.0432696","class":"highway","type":"bus_stop","place_rank":30,"importance":9.99999999995449e-06,"addresstype":"highway","name":"St Matthew's Church","display_name":"St Matthew's Church, South Street, Ponders End, London Borough of Enfield, London, Greater London, England, EN3 4JZ, United Kingdom","boundingbox":["51.6436402","51.6437402","-0.0433196","-0.0432196"]}];
          case "Queen Mary University, London":
            // prettier-ignore
            return [{"place_id":369319420,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"relation","osm_id":16416944,"lat":"51.52492685","lon":"-0.03924405317429028","class":"amenity","type":"university","place_rank":30,"importance":0.517686983487511,"addresstype":"amenity","name":"Queen Mary University of London","display_name":"Queen Mary University of London, 327, Mile End Road, Globe Town, Mile End, London Borough of Tower Hamlets, London, Greater London, England, E1 4NS, United Kingdom","boundingbox":["51.5223150","51.5272322","-0.0442567","-0.0371746"]}];
        }
        return [];
      },
    },
  ],
  apolloClient: {
    mocks: [
      {
        request: {
          query: LIST_ROUTE_OPTIONS_QUERY,
        },
        variableMatcher: (variables) => true,
        maxUsageCount: Number.POSITIVE_INFINITY,
        delay: 500,
        /**
         * Mock backend route options endpoint. Note that the mocked response is always the same for this story.
         * The response was generated specifically for starting point "St. Matthew's Church, London" and destination
         * "Queen Mary University, London".
         */
        result: {
          data: {
            // prettier-ignore
            listRouteOptions:[{provider:{id:"tfl-santander-cycles",name:"Santander Cycles",__typename:"Provider"},fromDockingStations:[{id:"003429",name:"Abbey Orchard Street, Westminster",location:{longitude:-.1321021999999914,latitude:51.4981256,__typename:"Coordinates"},__typename:"DockingStation"},{id:"001170",name:"Horseferry Road, Westminster",location:{longitude:-.13045856,latitude:51.49481649,__typename:"Coordinates"},__typename:"DockingStation"},{id:"003480",name:"Smith Square, Westminster",location:{longitude:-.127575233,latitude:51.49580589,__typename:"Coordinates"},__typename:"DockingStation"},{id:"200231",name:"Abingdon Green, Westminster",location:{longitude:-.12597218,latitude:51.49764,__typename:"Coordinates"},__typename:"DockingStation"},{id:"002662",name:"Butler Place, Westminster",location:{longitude:-.135440826,latitude:51.49782999,__typename:"Coordinates"},__typename:"DockingStation"},{id:"003457",name:"Rochester Row, Westminster",location:{longitude:-.13547809,latitude:51.49582705,__typename:"Coordinates"},__typename:"DockingStation"},{id:"010623",name:"Greycoat Street , Westminster",location:{longitude:-.134234258,latitude:51.49459148,__typename:"Coordinates"},__typename:"DockingStation"},{id:"200202",name:"Storey's Gate, Westminster",location:{longitude:-.129698963,latitude:51.50070305,__typename:"Coordinates"},__typename:"DockingStation"},{id:"200048",name:"Page Street, Westminster",location:{longitude:-.127554,latitude:51.493978,__typename:"Coordinates"},__typename:"DockingStation"},{id:"022161",name:"Vincent Street, Pimlico",location:{longitude:-.129925,latitude:51.493072,__typename:"Coordinates"},__typename:"DockingStation"},{id:"300202",name:"Kings Gate House, Westminster",location:{longitude:-.137598896295,latitude:51.4976984561,__typename:"Coordinates"},__typename:"DockingStation"},],toDockingStations:[{id:"200161",name:"Clinton Road, Mile End",location:{longitude:-.036017,latitude:51.525941,__typename:"Coordinates"},__typename:"DockingStation"},{id:"200249",name:"Queen Mary's, Mile End",location:{longitude:-.041378,latitude:51.522507,__typename:"Coordinates"},__typename:"DockingStation"},{id:"200102",name:"Harford Street, Mile End",location:{longitude:-.039264,latitude:51.521564,__typename:"Coordinates"},__typename:"DockingStation"},{id:"200041",name:"Antill Road, Mile End",location:{longitude:-.037471,latitude:51.528224,__typename:"Coordinates"},__typename:"DockingStation"},{id:"200230",name:"Maplin Street, Mile End",location:{longitude:-.032267204,latitude:51.525501,__typename:"Coordinates"},__typename:"DockingStation"},],__typename:"DockedEBikeRouteOption"},],
          },
        },
      },
    ],
  },
};

export const TestNoRouteOptions = {
  decorators: [(story) => <Provider store={initStore()}>{story()}</Provider>],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    /******************
     * STARTING POINT *
     *****************/

    // User types in the starting point
    await fillInStartingPoint(canvas, "Lukla Airport");

    // Micro-commute shows a list of suggested addresses for the starting point
    // Then, user scans the options and clicks the first suggested address
    await waitForLocationSuggestionsToShowAndClickFirst(canvas);

    // Micro-commute sets the input value of the starting point input to the option clicked by the user
    // Micro-commute also pans the map to the starting point and adds a marker for it
    // prettier-ignore
    const expectedStartingPointValue = (
      "Tenzing-Hillary Airport, Lukla to Namche kun, Khumbupasanglahmu-02, " +
      "Lukla, Khumbupasanglahmu, Solukhumbu, Koshi Province, Nepal"
    );
    await expectStartingPointValue(canvas, expectedStartingPointValue);
    await expectStartingPointMapMarker(canvas, expectedStartingPointValue);

    /***************
     * DESTINATION *
     **************/

    // User types in the destination
    await fillInDestination(canvas, "Everest Base Camp");

    // Micro-commute shows a list of suggested addresses for the destination
    // Then, user scans the options and clicks the first suggested address
    await waitForLocationSuggestionsToShowAndClickFirst(canvas);

    // Micro-commute sets the input value of the destination input to the option clicked by the user
    // prettier-ignore
    await expectDestinationValue(canvas, (
      "Everest Base Camp, Gorak Shep-Kala Patthar, Gorak Shep, Khumbupasanglahmu-04, " +
      "Khumbupasanglahmu, Solukhumbu, Koshi Province, Nepal"
    ));

    /********************
     * NO ROUTE OPTIONS *
     *******************/

    const noRouteOptionsMessage = await canvas.findByText("No route options");
    expect(noRouteOptionsMessage).toBeInTheDocument();
  },
};

TestNoRouteOptions.parameters = {
  mockData: [
    {
      url: "https://nominatim.openstreetmap.org/search?q=query&format=json",
      method: "GET",
      status: 200,
      /**
       * Mock OpenStreetMap address lookup for the two locations used in the test:
       *   - Lukla Airport
       *   - Everest Base Camp
       */
      response: ({ searchParams }) => {
        switch (searchParams.q) {
          case "Lukla Airport":
            // prettier-ignore
            return [{"place_id":240706629,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"way","osm_id":377662838,"lat":"27.686601250000002","lon":"86.7291581978985","class":"aeroway","type":"aerodrome","place_rank":30,"importance":0.3588882901947148,"addresstype":"aeroway","name":"Tenzing-Hillary Airport","display_name":"Tenzing-Hillary Airport, Lukla to Namche kun, Khumbupasanglahmu-02, Lukla, Khumbupasanglahmu, Solukhumbu, Koshi Province, Nepal","boundingbox":["27.6852246","27.6881732","86.7267839","86.7322379"]},{"place_id":383827646,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"way","osm_id":1257098603,"lat":"27.6866919","lon":"86.7291708","class":"aeroway","type":"runway","place_rank":30,"importance":9.99999999995449e-06,"addresstype":"aeroway","name":"06/24","display_name":"06/24, Lukla to Namche kun, Khumbupasanglahmu-02, Lukla, Khumbupasanglahmu, Solukhumbu, Koshi Province, Nepal","boundingbox":["27.6857075","27.6879891","86.7272674","86.7316789"]}];
          case "Everest Base Camp":
            // prettier-ignore
            return [{"place_id":208501459,"licence":"Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright","osm_type":"node","osm_id":5225912921,"lat":"27.9996646","lon":"86.8487946","class":"tourism","type":"camp_site","place_rank":30,"importance":5.000152590214416e-05,"addresstype":"tourism","name":"Everest Base Camp","display_name":"Everest Base Camp, Gorak Shep-Kala Patthar, Gorak Shep, Khumbupasanglahmu-04, Khumbupasanglahmu, Solukhumbu, Koshi Province, Nepal","boundingbox":["27.9996146","27.9997146","86.8487446","86.8488446"]}];
        }
        return [];
      },
    },
  ],
};

//////////////////
// TEST HELPERS //
//////////////////

function sleep(t) {
  return new Promise((r) => setTimeout(r, t));
}

async function fillInStartingPoint(canvas, text) {
  const input = canvas.getByLabelText(/starting point/i);
  await userEvent.type(input, text, { delay: 100 });
}

async function fillInDestination(canvas, text) {
  const input = canvas.getByLabelText(/destination/i);
  await userEvent.type(input, text, { delay: 100 });
}

async function expectStartingPointValue(canvas, value) {
  const input = canvas.getByLabelText(/starting point/i);
  expect(input).toHaveValue(value);
}

async function expectDestinationValue(canvas, value) {
  const input = canvas.getByLabelText(/destination/i);
  expect(input).toHaveValue(value);
}

async function waitForLocationSuggestionsToShowAndClickFirst(canvas) {
  const startingPointOptions = await canvas.findByRole("listbox");
  await sleep(500);
  await userEvent.click(within(startingPointOptions).getAllByRole("option")[0]);
}

async function expectStartingPointMapMarker(canvas, value) {
  const marker = await canvas.getByAltText(/starting point marker/i);
  expect(marker).toHaveAttribute("title", value);
}

async function expectRouteOptions(canvas, headings) {
  const routeOptions = await canvas.findAllByRole("option", {
    name: /route option/i,
  });
  const actualHeadings = routeOptions.map(
    (option) => within(option).getByRole("heading").innerText,
  );
  await expect(headings).toEqual(actualHeadings);
  return routeOptions;
}

async function expectFromStation(routeOption, stationName) {
  const label = "From docking station";
  const input = await within(routeOption).findByLabelText(label);
  expect(input).toHaveDisplayValue(stationName);
}

async function expectToStation(routeOption, stationName) {
  const label = "To docking station";
  const input = await within(routeOption).findByLabelText(label);
  expect(input).toHaveDisplayValue(stationName);
}

async function setFromStation(routeOption, stationName) {
  await sleep(1000);
  const label = "From docking station";
  const input = await within(routeOption).findByLabelText(label);
  await userEvent.selectOptions(input, stationName);
}

async function setToStation(routeOption, stationName) {
  await sleep(1000);
  const label = "To docking station";
  const input = await within(routeOption).findByLabelText(label);
  await userEvent.selectOptions(input, stationName);
}
