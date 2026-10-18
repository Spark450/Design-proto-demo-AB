import React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@abgov/web-components";
import "./index.css";

import { App } from "./App";
import { ErrorBoundary } from "./shared/ErrorBoundary";

/* The router's base comes from the path Vite built for, so the same app works
   at the site root, under /preview/<branch>/ and under /v/<name>/. Pages use
   real addresses (not #/ ones), so any link can be shared and reloaded. */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>,
);
