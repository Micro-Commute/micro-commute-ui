const {configureLeaflet} = require("./src/lib/leaflet");

require("./src/styles/reset.css")

exports.onInitialClientRender = function() {
  configureLeaflet();
}
