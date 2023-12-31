import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";
import { router } from "./router";
import { AuthProvider } from "./contexts/authContext";
import { ToastContextProvider } from "./contexts/hooks/ToastContext";

const getApiUrl = () => {
  if (window.location.href.includes("wilders.dev")) {
    return window.location.href.includes("staging.hopper1.wns.wilders.dev")
      ? "https://api.staging.hopper1.wns.wilders.dev"
      : "https://api.hopper1.wns.wilders.dev";
  }
  return "http://localhost:5000";
};
const httpLink = createHttpLink({
  uri: getApiUrl(),
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
export const Wrapper = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return (
    <React.StrictMode>
      <ApolloProvider client={client}>
        <AuthProvider>
          <ToastContextProvider>
            <RouterProvider router={router} />
          </ToastContextProvider>
        </AuthProvider>
      </ApolloProvider>
    </React.StrictMode>
  );
};
