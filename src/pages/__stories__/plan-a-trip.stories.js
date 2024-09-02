import PlanATripPage from "../plan-a-trip";
import {
  GET_DOCKED_EBIKE_ROUTE_OPTION_DETAILS_QUERY,
  LIST_ROUTE_OPTIONS_QUERY,
} from "../../modules/planatrip/graphql";
import { Provider } from "react-redux";
import React from "react";
import { initStore } from "../../modules/store";
import { expect, userEvent, within } from "@storybook/test";
import {
  arriveByDateTimeChanged,
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
    preLoadedStore.dispatch(arriveByDateTimeChanged("2024-09-01T12:34"));
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
      {
        request: {
          query: GET_DOCKED_EBIKE_ROUTE_OPTION_DETAILS_QUERY,
        },
        variableMatcher: (variables) => true,
        maxUsageCount: Number.POSITIVE_INFINITY,
        delay: 500,
        result: {
          data: {
            getDockedEbikeRouteOptionDetails: {
              leaveAt: "2024-09-05T12:06:12.300000",
              takeBikeAt: "2024-09-05T12:07:23.400000",
              parkBikeAt: "2024-09-05T12:30:58.200000",
              walkingTimeFromStartingPoint: "PT1M11.1S",
              cyclingTimeStationToStation: "PT23M34.8S",
              walkingTimeToDestination: "PT3M1.8S",
              usualAvailabilityAtBikePickupStation: {
                standardBikes: 9,
                electricBikes: 7,
                emptyDocks: 3,
                totalDocks: 19,
                __typename: "UsualDockingStationAvailability",
              },
              usualAvailabilityAtBikeDropOffStation: {
                standardBikes: 17,
                electricBikes: 3,
                emptyDocks: 15,
                totalDocks: 32,
                __typename: "UsualDockingStationAvailability",
              },
              // prettier-ignore
              "featureCollection": "{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"coordinates\":[[-0.130399,51.497122],[-0.130321,51.496861],[-0.129674,51.4969],[-0.129599,51.496905],[-0.129555,51.496908],[-0.129367,51.496919],[-0.129233,51.496925],[-0.129179,51.496926],[-0.129109,51.496926],[-0.128503,51.496935],[-0.127704,51.496917],[-0.12712,51.496939],[-0.126641,51.496959],[-0.126642,51.496999],[-0.126622,51.49754],[-0.126623,51.497566],[-0.126403,51.497565],[-0.125973,51.497563]],\"type\":\"LineString\"}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"coordinates\":[[-0.125973,51.497563],[-0.125873,51.497562],[-0.125822,51.497563],[-0.1257,51.497563],[-0.125691,51.497491],[-0.125685,51.49744],[-0.125676,51.497388],[-0.125628,51.497066],[-0.125614,51.496985],[-0.125606,51.496944],[-0.12541,51.496075],[-0.125388,51.495981],[-0.12535,51.495837],[-0.125324,51.495721],[-0.125302,51.495636],[-0.125274,51.49553],[-0.125242,51.495407],[-0.125213,51.495318],[-0.12518,51.495223],[-0.125137,51.495165],[-0.125098,51.495054],[-0.125035,51.494908],[-0.125051,51.494873],[-0.12502,51.494854],[-0.124995,51.494832],[-0.124934,51.494816],[-0.124862,51.494805],[-0.124797,51.494784],[-0.124767,51.494774],[-0.124725,51.494767],[-0.124477,51.49471],[-0.123869,51.494649],[-0.123618,51.494622],[-0.121784,51.494426],[-0.12143,51.494387],[-0.121353,51.494397],[-0.121313,51.494397],[-0.121275,51.494398],[-0.121206,51.494399],[-0.121149,51.494405],[-0.121114,51.494408],[-0.121063,51.494416],[-0.121001,51.494431],[-0.120974,51.494476],[-0.120944,51.494502],[-0.120879,51.494528],[-0.120815,51.494541],[-0.120757,51.494542],[-0.120631,51.494511],[-0.120613,51.494497],[-0.120495,51.494404],[-0.120445,51.494389],[-0.120374,51.494367],[-0.120315,51.49436],[-0.120304,51.494361],[-0.120265,51.494363],[-0.120161,51.494367],[-0.119995,51.494454],[-0.119885,51.494514],[-0.119786,51.494571],[-0.119771,51.494611],[-0.119644,51.494676],[-0.119593,51.494697],[-0.119462,51.494739],[-0.119423,51.494749],[-0.119351,51.494738],[-0.119288,51.494751],[-0.119076,51.494781],[-0.118964,51.494798],[-0.11893,51.494804],[-0.118894,51.49481],[-0.118142,51.494929],[-0.117298,51.495073],[-0.117093,51.495115],[-0.116913,51.495155],[-0.11675,51.495198],[-0.116675,51.495215],[-0.116599,51.495234],[-0.116466,51.495268],[-0.116277,51.495314],[-0.116263,51.495318],[-0.11617,51.495384],[-0.115597,51.495519],[-0.115455,51.495506],[-0.115435,51.495511],[-0.115289,51.495552],[-0.115203,51.495577],[-0.115051,51.49562],[-0.114889,51.495659],[-0.114826,51.495673],[-0.114801,51.495679],[-0.114699,51.495704],[-0.114501,51.495752],[-0.114414,51.495773],[-0.113903,51.495891],[-0.113531,51.495981],[-0.11313,51.49608],[-0.113024,51.496103],[-0.112757,51.496171],[-0.112649,51.496197],[-0.112472,51.49624],[-0.112281,51.496286],[-0.112234,51.496298],[-0.1122,51.496305],[-0.111777,51.496399],[-0.111713,51.496413],[-0.111651,51.496426],[-0.111487,51.496461],[-0.111452,51.496469],[-0.111293,51.496502],[-0.111228,51.496517],[-0.111175,51.49653],[-0.110697,51.496645],[-0.11025,51.496755],[-0.11014,51.496781],[-0.11,51.496815],[-0.109692,51.49689],[-0.108571,51.497161],[-0.108407,51.497204],[-0.108302,51.497231],[-0.108237,51.497246],[-0.108188,51.497257],[-0.10819,51.497268],[-0.10819,51.497276],[-0.108188,51.497283],[-0.108185,51.497287],[-0.108179,51.497292],[-0.108171,51.497295],[-0.108066,51.497332],[-0.108004,51.497352],[-0.107955,51.49737],[-0.107937,51.497374],[-0.107922,51.497377],[-0.107903,51.497379],[-0.107882,51.497381],[-0.107801,51.497386],[-0.10774,51.497391],[-0.107725,51.497393],[-0.107711,51.497393],[-0.107685,51.497393],[-0.107914,51.497508],[-0.107992,51.497542],[-0.108077,51.497586],[-0.108416,51.49774],[-0.109221,51.498137],[-0.109232,51.498173],[-0.109242,51.498221],[-0.109236,51.498251],[-0.109225,51.498293],[-0.109199,51.498329],[-0.109147,51.498358],[-0.108794,51.49838],[-0.108675,51.498387],[-0.108561,51.498394],[-0.108538,51.498396],[-0.107891,51.498435],[-0.107493,51.498467],[-0.10743,51.498472],[-0.107354,51.498484],[-0.107245,51.498494],[-0.10716,51.498502],[-0.106526,51.498579],[-0.106479,51.498583],[-0.106359,51.498541],[-0.106306,51.498546],[-0.106242,51.498551],[-0.106135,51.498598],[-0.106008,51.498614],[-0.10591,51.49862],[-0.105836,51.498631],[-0.105784,51.498639],[-0.105601,51.498661],[-0.105537,51.498664],[-0.105479,51.498668],[-0.105439,51.49867],[-0.105392,51.498702],[-0.105324,51.498706],[-0.105245,51.498711],[-0.105174,51.498717],[-0.105118,51.498721],[-0.105022,51.49874],[-0.104896,51.49876],[-0.104844,51.498787],[-0.104784,51.498807],[-0.104745,51.498812],[-0.104703,51.49881],[-0.104625,51.498792],[-0.104596,51.498775],[-0.104435,51.49877],[-0.104357,51.498771],[-0.10424,51.498774],[-0.103973,51.498775],[-0.103862,51.498764],[-0.103773,51.498752],[-0.103717,51.498756],[-0.103629,51.498764],[-0.103012,51.498815],[-0.102819,51.498828],[-0.102758,51.498833],[-0.102577,51.498849],[-0.102548,51.498851],[-0.102014,51.498896],[-0.101817,51.498912],[-0.101605,51.49893],[-0.101515,51.498937],[-0.101117,51.498965],[-0.10067,51.498996],[-0.100587,51.499],[-0.100242,51.49903],[-0.100145,51.499038],[-0.100116,51.499041],[-0.100074,51.499044],[-0.100013,51.499046],[-0.099853,51.49905],[-0.099707,51.499056],[-0.099632,51.499062],[-0.099625,51.499063],[-0.099566,51.499068],[-0.099425,51.499079],[-0.099214,51.499095],[-0.098694,51.499142],[-0.098369,51.499173],[-0.097679,51.49922],[-0.097481,51.499229],[-0.097356,51.499235],[-0.097278,51.499236],[-0.097201,51.499228],[-0.097148,51.499214],[-0.097087,51.499186],[-0.096941,51.49911],[-0.096785,51.499197],[-0.09673,51.499232],[-0.096566,51.499329],[-0.096435,51.499396],[-0.095798,51.499769],[-0.095749,51.499797],[-0.095712,51.499818],[-0.095575,51.499903],[-0.095509,51.499942],[-0.095469,51.499963],[-0.09543,51.499983],[-0.095378,51.500012],[-0.095081,51.500171],[-0.094661,51.500378],[-0.094228,51.500594],[-0.094044,51.500695],[-0.093931,51.500762],[-0.093814,51.500829],[-0.093604,51.500959],[-0.093532,51.501067],[-0.093457,51.501115],[-0.093419,51.50114],[-0.09337,51.501177],[-0.093286,51.501255],[-0.093229,51.501318],[-0.093137,51.501423],[-0.093121,51.501439],[-0.092962,51.501505],[-0.092809,51.501664],[-0.092659,51.50181],[-0.092577,51.501912],[-0.092489,51.502044],[-0.092455,51.502096],[-0.092421,51.502155],[-0.092398,51.502201],[-0.092375,51.502244],[-0.092306,51.502391],[-0.092266,51.502463],[-0.092208,51.502565],[-0.092153,51.50266],[-0.092031,51.502828],[-0.091952,51.502928],[-0.09191,51.502981],[-0.091841,51.503076],[-0.091806,51.503118],[-0.091774,51.503158],[-0.09174,51.503199],[-0.091674,51.503281],[-0.091644,51.503319],[-0.091595,51.503379],[-0.091564,51.503419],[-0.091546,51.503442],[-0.091535,51.503456],[-0.091404,51.503607],[-0.091308,51.503719],[-0.091293,51.503737],[-0.09126,51.503775],[-0.091146,51.50391],[-0.091081,51.503988],[-0.091041,51.50403],[-0.090997,51.504079],[-0.090846,51.504177],[-0.090681,51.504291],[-0.090445,51.504462],[-0.090378,51.504518],[-0.090255,51.504612],[-0.090254,51.504648],[-0.090244,51.50466],[-0.09022,51.504686],[-0.090208,51.504697],[-0.090093,51.504797],[-0.090013,51.504865],[-0.089937,51.504901],[-0.089925,51.504906],[-0.089869,51.504915],[-0.08977,51.504986],[-0.089662,51.505065],[-0.089597,51.505103],[-0.089553,51.505133],[-0.089492,51.505173],[-0.089466,51.505194],[-0.089437,51.505213],[-0.089373,51.505269],[-0.089333,51.505299],[-0.089283,51.50534],[-0.089164,51.505438],[-0.089126,51.505538],[-0.08904,51.505625],[-0.088951,51.505695],[-0.088907,51.505729],[-0.088821,51.505798],[-0.088743,51.505875],[-0.088626,51.506003],[-0.088598,51.506035],[-0.088574,51.50606],[-0.088557,51.506079],[-0.088412,51.506278],[-0.088399,51.506298],[-0.088385,51.50632],[-0.088381,51.506327],[-0.088365,51.506361],[-0.088311,51.506474],[-0.088283,51.506545],[-0.088211,51.506733],[-0.088194,51.506796],[-0.088112,51.507012],[-0.08741,51.508987],[-0.087319,51.509261],[-0.087222,51.509503],[-0.087208,51.509543],[-0.087203,51.509554],[-0.087106,51.509806],[-0.087085,51.509858],[-0.087069,51.509904],[-0.08698,51.510168],[-0.086954,51.51024],[-0.086919,51.510321],[-0.086896,51.510376],[-0.086888,51.510395],[-0.08688,51.510415],[-0.086791,51.510617],[-0.086758,51.510692],[-0.086741,51.510729],[-0.086725,51.510764],[-0.086705,51.510795],[-0.08667,51.510855],[-0.086631,51.510914],[-0.086548,51.510899],[-0.086466,51.510893],[-0.086398,51.510889],[-0.086313,51.510894],[-0.086232,51.510901],[-0.086151,51.510919],[-0.086064,51.510952],[-0.085939,51.51101],[-0.085885,51.511039],[-0.085591,51.511202],[-0.085571,51.511225],[-0.085493,51.511344],[-0.085475,51.511374],[-0.085451,51.511414],[-0.085447,51.511422],[-0.085404,51.51149],[-0.08524,51.511729],[-0.085217,51.511766],[-0.085196,51.511798],[-0.085135,51.511898],[-0.084921,51.51186],[-0.084874,51.51185],[-0.083856,51.511685],[-0.083774,51.511671],[-0.083667,51.511653],[-0.08362,51.511645],[-0.083563,51.511638],[-0.083,51.511576],[-0.082679,51.511571],[-0.082506,51.511573],[-0.082316,51.511585],[-0.082109,51.511612],[-0.081843,51.511662],[-0.081575,51.511721],[-0.081246,51.511799],[-0.080832,51.511909],[-0.080811,51.511915],[-0.080385,51.512052],[-0.080209,51.512092],[-0.08013,51.512113],[-0.080051,51.512132],[-0.07998,51.512152],[-0.07992,51.51217],[-0.079689,51.512242],[-0.079549,51.51229],[-0.079366,51.51237],[-0.079228,51.512433],[-0.079142,51.512468],[-0.078678,51.512676],[-0.078458,51.512788],[-0.078342,51.512843],[-0.078115,51.512947],[-0.077904,51.513059],[-0.077851,51.513086],[-0.077797,51.513116],[-0.077771,51.513142],[-0.077722,51.513217],[-0.077687,51.51327],[-0.077653,51.513296],[-0.077528,51.513346],[-0.077112,51.513491],[-0.076838,51.513564],[-0.076771,51.513581],[-0.076713,51.513573],[-0.076661,51.513588],[-0.076587,51.513612],[-0.076522,51.513631],[-0.076449,51.513655],[-0.076376,51.513678],[-0.076106,51.513759],[-0.076013,51.51379],[-0.075528,51.513954],[-0.075463,51.513976],[-0.075406,51.513994],[-0.075298,51.514028],[-0.075225,51.514051],[-0.075158,51.514073],[-0.074821,51.514198],[-0.07475,51.514224],[-0.074583,51.514282],[-0.074522,51.514302],[-0.074432,51.514333],[-0.074345,51.514408],[-0.074283,51.51443],[-0.074238,51.514446],[-0.074112,51.514492],[-0.074001,51.514536],[-0.073857,51.51459],[-0.07368,51.514635],[-0.073561,51.514637],[-0.073442,51.514681],[-0.073345,51.514715],[-0.073123,51.514793],[-0.072691,51.51494],[-0.072368,51.515044],[-0.072331,51.515094],[-0.072266,51.515119],[-0.072045,51.515197],[-0.071967,51.515226],[-0.07191,51.515246],[-0.071858,51.515266],[-0.071755,51.515305],[-0.071711,51.515323],[-0.071626,51.515359],[-0.071184,51.51552],[-0.071019,51.515575],[-0.070867,51.515629],[-0.070756,51.515669],[-0.070695,51.515691],[-0.07068,51.515696],[-0.070623,51.515715],[-0.070432,51.515781],[-0.070348,51.51581],[-0.070263,51.515837],[-0.070185,51.515868],[-0.070115,51.515899],[-0.070068,51.515922],[-0.070025,51.515943],[-0.069926,51.515992],[-0.069859,51.516027],[-0.069791,51.516057],[-0.069747,51.516079],[-0.069732,51.516086],[-0.069665,51.516114],[-0.069527,51.516175],[-0.06941,51.516228],[-0.069383,51.51624],[-0.069335,51.516259],[-0.069263,51.51626],[-0.069215,51.516285],[-0.069213,51.516285],[-0.069009,51.51638],[-0.068798,51.516478],[-0.068485,51.516622],[-0.068418,51.516653],[-0.068322,51.516697],[-0.068149,51.516776],[-0.068104,51.516797],[-0.067883,51.516907],[-0.067746,51.516967],[-0.067563,51.517045],[-0.0674,51.517113],[-0.067362,51.517128],[-0.067284,51.517159],[-0.067226,51.517181],[-0.067121,51.517221],[-0.066941,51.517282],[-0.066886,51.5173],[-0.066682,51.517366],[-0.066173,51.517529],[-0.065897,51.51762],[-0.065812,51.517645],[-0.065765,51.517659],[-0.065759,51.51766],[-0.065665,51.517688],[-0.065573,51.517715],[-0.065568,51.517716],[-0.065402,51.517764],[-0.065254,51.517807],[-0.065112,51.517847],[-0.065011,51.517875],[-0.064979,51.517884],[-0.064846,51.51792],[-0.064464,51.518028],[-0.06406,51.518141],[-0.063974,51.518163],[-0.063814,51.518203],[-0.063404,51.518309],[-0.063347,51.518323],[-0.063272,51.518341],[-0.063217,51.518384],[-0.063192,51.5184],[-0.063057,51.518418],[-0.062995,51.518434],[-0.062937,51.518445],[-0.062819,51.518493],[-0.062721,51.518524],[-0.062435,51.518582],[-0.062376,51.518595],[-0.062323,51.518603],[-0.062143,51.518586],[-0.061623,51.5187],[-0.061526,51.518721],[-0.061404,51.518748],[-0.06127,51.518777],[-0.061198,51.518836],[-0.061124,51.518853],[-0.061025,51.518875],[-0.060921,51.518851],[-0.060698,51.518903],[-0.060444,51.518958],[-0.060114,51.519034],[-0.060006,51.519056],[-0.059927,51.519074],[-0.059597,51.519161],[-0.059504,51.519182],[-0.059378,51.519211],[-0.059188,51.519254],[-0.058823,51.519332],[-0.05806,51.519494],[-0.058024,51.519501],[-0.057932,51.519521],[-0.057893,51.51953],[-0.057597,51.519593],[-0.05741,51.519634],[-0.057059,51.519705],[-0.056864,51.519782],[-0.056698,51.519819],[-0.056627,51.519832],[-0.056576,51.519841],[-0.056446,51.519885],[-0.056291,51.519917],[-0.056222,51.519934],[-0.056134,51.519946],[-0.056061,51.519955],[-0.055998,51.519964],[-0.05593,51.519972],[-0.055857,51.519978],[-0.055833,51.519981],[-0.055742,51.519996],[-0.055259,51.52007],[-0.055117,51.520072],[-0.054717,51.520153],[-0.054176,51.520236],[-0.053771,51.520316],[-0.053642,51.520341],[-0.053581,51.520353],[-0.053518,51.520364],[-0.053205,51.520419],[-0.053175,51.520424],[-0.053061,51.520448],[-0.052967,51.520468],[-0.052634,51.520533],[-0.052282,51.520606],[-0.052155,51.520634],[-0.051995,51.520668],[-0.05169,51.520731],[-0.051069,51.520855],[-0.050978,51.520873],[-0.050913,51.520896],[-0.050882,51.520904],[-0.050664,51.520946],[-0.050507,51.520972],[-0.05041,51.521032],[-0.050367,51.521041],[-0.050316,51.521051],[-0.050218,51.521071],[-0.050164,51.521082],[-0.050068,51.521101],[-0.049954,51.521124],[-0.049827,51.521149],[-0.049727,51.521171],[-0.049458,51.521229],[-0.049409,51.521239],[-0.049341,51.521253],[-0.04925,51.521229],[-0.049224,51.521236],[-0.048976,51.521289],[-0.048758,51.521335],[-0.048575,51.521374],[-0.04834,51.521423],[-0.047787,51.521541],[-0.04761,51.521578],[-0.047526,51.521596],[-0.047461,51.52161],[-0.046937,51.521711],[-0.046855,51.521727],[-0.046802,51.521737],[-0.04667,51.521761],[-0.046647,51.521766],[-0.046555,51.521817],[-0.046545,51.521819],[-0.046449,51.521839],[-0.046396,51.52185],[-0.046324,51.521865],[-0.046259,51.521877],[-0.046175,51.52185],[-0.046112,51.521863],[-0.045934,51.521901],[-0.045637,51.521963],[-0.045577,51.522009],[-0.045516,51.522021],[-0.04526,51.522064],[-0.045173,51.522039],[-0.044906,51.522086],[-0.044652,51.522138],[-0.044375,51.522189],[-0.044307,51.5222],[-0.043877,51.522249],[-0.043731,51.522258],[-0.043331,51.522276],[-0.043157,51.522288],[-0.042945,51.52231],[-0.042864,51.522321],[-0.042705,51.522347],[-0.042648,51.522356],[-0.042583,51.52237],[-0.042377,51.52241],[-0.042249,51.522432],[-0.042158,51.522489],[-0.042095,51.522503],[-0.042026,51.522515],[-0.041919,51.522493],[-0.041845,51.522508],[-0.041796,51.522518],[-0.041356,51.522598],[-0.040951,51.522696],[-0.040766,51.522746],[-0.040632,51.522787],[-0.040503,51.522828],[-0.040467,51.522872],[-0.040402,51.522893],[-0.04025,51.522945],[-0.04022,51.522953],[-0.04006,51.523],[-0.039983,51.523024],[-0.039917,51.523044],[-0.039884,51.523055],[-0.039759,51.523095],[-0.03971,51.523111],[-0.039652,51.52313],[-0.039545,51.523113],[-0.039448,51.523147],[-0.039282,51.523203],[-0.039262,51.523211],[-0.039221,51.523227],[-0.039116,51.523268],[-0.038863,51.523369],[-0.038635,51.523478],[-0.038425,51.523583],[-0.038287,51.523654],[-0.03795,51.523833],[-0.03785,51.523928],[-0.037688,51.524026],[-0.037636,51.524052],[-0.037571,51.524079],[-0.03739,51.524155],[-0.037282,51.524188],[-0.037191,51.524183],[-0.037083,51.524227],[-0.037028,51.524247],[-0.036989,51.524262],[-0.036956,51.524274],[-0.036814,51.524332],[-0.03672,51.524363],[-0.036668,51.52438],[-0.036456,51.524461],[-0.036361,51.524495],[-0.035619,51.524771],[-0.035554,51.524798],[-0.035433,51.524834],[-0.035404,51.524843],[-0.035273,51.524922],[-0.035256,51.524931],[-0.03524,51.524941],[-0.035222,51.524953],[-0.035171,51.524999],[-0.035106,51.525024],[-0.035018,51.525053],[-0.034915,51.525052],[-0.03493,51.525102],[-0.034953,51.525176],[-0.03499,51.525214],[-0.034993,51.525234],[-0.035112,51.525551],[-0.035075,51.525617],[-0.035087,51.525639],[-0.035123,51.525692],[-0.035192,51.525794],[-0.035219,51.525845],[-0.035302,51.525944],[-0.035333,51.525981],[-0.03536,51.526014],[-0.035385,51.526044],[-0.03544,51.526106],[-0.035489,51.526161],[-0.035591,51.526263],[-0.035699,51.526372],[-0.035914,51.526589],[-0.03602,51.526695],[-0.036166,51.526834],[-0.036234,51.526899],[-0.036472,51.527127],[-0.036529,51.527181],[-0.036647,51.527289],[-0.036658,51.5273],[-0.036706,51.527344],[-0.03676,51.527399],[-0.036818,51.527457],[-0.0369,51.527421],[-0.037154,51.527312],[-0.037169,51.527306],[-0.037199,51.527295],[-0.037511,51.527141],[-0.037495,51.527124],[-0.037286,51.526941],[-0.037261,51.526918],[-0.036142,51.52594],[-0.036066,51.525978]],\"type\":\"LineString\"}},{\"type\":\"Feature\",\"properties\":{},\"geometry\":{\"coordinates\":[[-0.036066,51.525978],[-0.036142,51.52594],[-0.037261,51.526918],[-0.037286,51.526941],[-0.037495,51.527124],[-0.037511,51.527141],[-0.037199,51.527295],[-0.037169,51.527306],[-0.037154,51.527312],[-0.0369,51.527421],[-0.036818,51.527457],[-0.03676,51.527399],[-0.036706,51.527344],[-0.036658,51.5273],[-0.036647,51.527289],[-0.036529,51.527181],[-0.036472,51.527127],[-0.036234,51.526899],[-0.036166,51.526834],[-0.03602,51.526695],[-0.035914,51.526589],[-0.035699,51.526372],[-0.035591,51.526263],[-0.035489,51.526161],[-0.03544,51.526106],[-0.035385,51.526044],[-0.03536,51.526014],[-0.035333,51.525981],[-0.035302,51.525944],[-0.035219,51.525845],[-0.035192,51.525794],[-0.035123,51.525692],[-0.035087,51.525639],[-0.035075,51.525617],[-0.034959,51.525586],[-0.034912,51.525533],[-0.034866,51.525432],[-0.034809,51.525291],[-0.034781,51.525227],[-0.034769,51.525199],[-0.03476,51.525172],[-0.034736,51.525103],[-0.034723,51.525063],[-0.034698,51.524989],[-0.034878,51.52493],[-0.035072,51.524872],[-0.035127,51.524855],[-0.035199,51.524841],[-0.035404,51.524843],[-0.035433,51.524834],[-0.035554,51.524798],[-0.035619,51.524771],[-0.036361,51.524495],[-0.036456,51.524461],[-0.036668,51.52438],[-0.03672,51.524363],[-0.036814,51.524332],[-0.036956,51.524274],[-0.036989,51.524262],[-0.037028,51.524247],[-0.037083,51.524227],[-0.037191,51.524183],[-0.037223,51.524134],[-0.037314,51.524092],[-0.03739,51.524155],[-0.037444,51.524199],[-0.037493,51.52424],[-0.03756,51.524295],[-0.037555,51.524349],[-0.037583,51.524384],[-0.037818,51.524553],[-0.038007,51.524686],[-0.038076,51.524699],[-0.038144,51.524711],[-0.038208,51.524751],[-0.038293,51.52479],[-0.038653,51.524929],[-0.038726,51.524957],[-0.0388,51.524986],[-0.038913,51.525043],[-0.038936,51.525059],[-0.038969,51.525082]],\"type\":\"LineString\"}}]}",
              __typename: "DockedEbikeRouteOptionDetails",
            },
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
