const {configureLeaflet} = require("./src/lib/leaflet");
const {wrapWithApolloProvider} = require("./src/lib/apollo");

require("./src/styles/reset.css")

exports.onInitialClientRender = function() {
  configureLeaflet();
}

exports.wrapRootElement = function({element}) {
  return wrapWithApolloProvider(element);
}
