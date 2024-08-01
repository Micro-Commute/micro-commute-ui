const {configureLeaflet} = require("./src/lib/leaflet");

exports.onInitialClientRender = function() {
  configureLeaflet();
}
