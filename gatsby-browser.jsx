const {configureLeaflet} = require("./src/modules/config/leaflet");
const {wrapWithApolloProvider} = require("./src/modules/config/apollo");

require("./src/styles/reset.css")

exports.onInitialClientRender = function() {
  configureLeaflet();
}

exports.wrapRootElement = function({element}) {
  element = wrapWithApolloProvider(element);
  return element;
}
