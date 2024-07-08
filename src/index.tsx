import React from "react";
import ReactDOM from "react-dom/client";
import { Redux } from "./provider/Redux";
import App from "./components/BHFinder";
import "./styles/index.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Redux>
      <App />
    </Redux>
  </React.StrictMode>
);
