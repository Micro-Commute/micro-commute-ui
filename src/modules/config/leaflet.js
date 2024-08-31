/** Source: https://github.com/colbyfayock/gatsby-starter-leaflet/blob/master/src/hooks/useConfigureLeaflet.js */
export function configureLeaflet() {
  const L = require("leaflet");
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png").default,
    iconUrl: require("leaflet/dist/images/marker-icon.png").default,
    shadowUrl: require("leaflet/dist/images/marker-shadow.png").default,
  });
}
