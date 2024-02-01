import React from "react";
import ReactDOM from "react-dom/client";
import DependencyProvider from "./lib/ui/global/DependenciesProvider/DependencyProvider.tsx";
import App from "./lib/ui/global/component/App/App.tsx";
import { CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "react-virtualized/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DependencyProvider>
      <CssBaseline />
      <ToastContainer />
      <App />
    </DependencyProvider>
  </React.StrictMode>,
);
