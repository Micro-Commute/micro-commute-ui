const {configureLeaflet} = require("./src/modules/config/leaflet");
const {wrapWithApolloProvider} = require("./src/modules/config/apollo");
const {wrapWithReduxProvider} = require("./src/modules/config/redux");

require("./src/styles/reset.css")

exports.onInitialClientRender = function() {
  configureLeaflet();
}

exports.wrapRootElement = function({element}) {
  element = wrapWithApolloProvider(element);
  element = wrapWithReduxProvider(element);
  return element;
}
