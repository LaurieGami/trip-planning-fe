import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import reportWebVitals from "./reportWebVitals";
import { ApolloProvider } from "@apollo/client";
import client from "./graphql/client";
import { AuthProvider } from "./context/authContext";
import ThemeProvider from "./theme";

import App from "./components/common/App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <ApolloProvider client={client}>
      <HelmetProvider>
        <BrowserRouter>
          <React.StrictMode>
            <ThemeProvider>
              <App />
            </ThemeProvider>
          </React.StrictMode>
        </BrowserRouter>
      </HelmetProvider>
    </ApolloProvider>
  </AuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
