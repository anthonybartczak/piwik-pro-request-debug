import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import PiwikPro from "@piwikpro/react-piwik-pro";

PiwikPro.initialize(
  "01eb8b1c-0f3f-4416-ae37-a9562f6fabb8",
  "https://abartczak.piwik.pro",
);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
