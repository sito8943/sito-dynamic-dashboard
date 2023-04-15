import React from "react";
import ReactDOM from "react-dom/client";

// contexts
import { NotificationProvider } from "./contexts/NotificationProvider";
import { LanguageProvider } from "./contexts/LanguageProvider";
import { UserProvider } from "./contexts/UserProvider";
import { ModeProvider } from "./contexts/ModeProvider";

// app
import App from "./App";

// animations
import "./assets/animations/grow.css";
import "./assets/animations/shake.css";
import "./assets/animations/appear.css";
// Import css files
import "tippy.js/dist/tippy.css"; // optional
// styles
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <LanguageProvider>
    <UserProvider>
      <ModeProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </ModeProvider>
    </UserProvider>
  </LanguageProvider>
);
