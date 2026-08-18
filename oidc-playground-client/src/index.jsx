import React from "react";
import { createRoot } from "react-dom/client";
import "./stylesheets/index.scss";
import App from "./pages/App";

createRoot(document.getElementById("app")).render(<App />);
