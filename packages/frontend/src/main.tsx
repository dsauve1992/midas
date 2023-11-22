import React from "react";
import ReactDOM from "react-dom/client";
import DependencyProvider from "./lib/ui/global/DependenciesProvider/DependencyProvider.tsx";
import App from "./lib/ui/global/component/App/App.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DependencyProvider>
      <App />
    </DependencyProvider>
  </React.StrictMode>,
);
