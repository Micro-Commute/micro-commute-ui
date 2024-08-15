const {wrapWithApolloProvider} = require("./src/modules/config/apollo");
const {wrapWithReduxProvider} = require("./src/modules/config/redux");

exports.wrapRootElement = function({element}) {
  element = wrapWithApolloProvider(element);
  element = wrapWithReduxProvider(element);
  return element;
}
