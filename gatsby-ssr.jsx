const {wrapWithApolloProvider} = require("./src/modules/config/apollo");

exports.wrapRootElement = function({element}) {
  element = wrapWithApolloProvider(element);
  return element;
}
