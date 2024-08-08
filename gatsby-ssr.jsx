const {wrapWithApolloProvider} = require("./src/lib/apollo");

exports.wrapRootElement = function({element}) {
  return wrapWithApolloProvider(element);
}
