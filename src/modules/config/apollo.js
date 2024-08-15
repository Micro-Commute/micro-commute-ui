import React from "react";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

export function wrapWithApolloProvider(element) {
  const client = new ApolloClient({
    uri: "https://micro-commute-backend.onrender.com/graphql",
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{element}</ApolloProvider>;
}
