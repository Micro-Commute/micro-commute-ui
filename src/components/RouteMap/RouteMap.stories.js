import RouteMap from "./RouteMap";

export default {
  title: "Components/RouteMap",
  component: RouteMap,
  tags: ["autodocs"],
};

export const Default = {
  args: {},
};

export const DockedEbike = {
  args: {
    route: {
      type: "docked-ebike",
      startingPoint: [41.40624877362421, 2.159413247558875],
      startingPointDockingStation: [41.40568486276983, 2.1624520213408296],
      destinationDockingStation: [41.38511382647192, 2.1431890499002897],
      destination: [41.38413627190235, 2.145163260838563],
    },
  },
};
