import React from "react";
import ReactDOM from "react-dom/client";

import ErrorBoundary from "sito-mui-error-component";
import NotificationContext from "sito-mui-notification";

// App
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ErrorBoundary>
    <NotificationContext>
      <App />
    </NotificationContext>
  </ErrorBoundary>
);
