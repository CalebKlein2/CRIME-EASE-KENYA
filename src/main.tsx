import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Prevent ethereum property error
if (
  window.ethereum &&
  Object.getOwnPropertyDescriptor(window, "ethereum")?.configurable
) {
  Object.defineProperty(window, "ethereum", {
    value: window.ethereum,
    writable: true,
    configurable: true,
  });
}

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
