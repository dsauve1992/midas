import Layout from "../Layout/Layout.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ProtectedRoute } from "../../../../../auth/ui/ProtectedRoute.tsx";

function App() {
  const navigate = useNavigate();

  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: `${import.meta.env.VITE_BACKEND_URL}`,
      }}
      onRedirectCallback={(appState) => {
        if (appState?.returnTo) {
          navigate(appState?.returnTo);
        }
      }}
    >
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path={"/*"} element={<Layout />} />
        </Route>
      </Routes>
    </Auth0Provider>
  );
}

export default App;
