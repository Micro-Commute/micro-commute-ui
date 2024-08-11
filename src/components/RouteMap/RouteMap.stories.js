import RouteMap from "./RouteMap";
import { TransportType } from "../../lib/types";

export default {
  title: "Components/RouteMap",
  component: RouteMap,
  tags: ["autodocs"],
};

export const Default = {
  args: {},
};

export const WithoutRouteOptions = {
  args: {
    activeRoute: {
      startingPoint: {
        latitude: 41.40624877362421,
        longitude: 2.159413247558875,
      },
      destination: {
        latitude: 41.38413627190235,
        longitude: 2.145163260838563,
      },
    },
  },
};

export const DockedEbike = {
  args: {
    activeRoute: {
      providerId: "some-provider",
      transportType: TransportType.DOCKED_EBIKE,
      startingPoint: {
        latitude: 41.40624877362421,
        longitude: 2.159413247558875,
      },
      destination: {
        latitude: 41.38413627190235,
        longitude: 2.145163260838563,
      },
      extraProperties: {
        fromDockingStation: {
          latitude: 41.40568486276983,
          longitude: 2.1624520213408296,
        },
        toDockingStation: {
          latitude: 41.38511382647192,
          longitude: 2.1431890499002897,
        },
      },
    },
  },
};
