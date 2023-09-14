import React from 'react'
import ReactDOM from 'react-dom/client'
import DependencyProvider from "./ui/global/DependenciesProvider/DependencyProvider.tsx";
import App from "./ui/global/component/App/App.tsx";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <DependencyProvider>
        <App />
      </DependencyProvider>
  </React.StrictMode>,
)

