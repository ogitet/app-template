import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "kiso.css";
import "./styles/global.css";
import { fixNarrowViewport } from "./viewport";

fixNarrowViewport();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
