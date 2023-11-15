import CssBaseline from '@mui/material/CssBaseline'
import Layout from '../Layout/Layout'
import {Auth0Provider} from '@auth0/auth0-react'
import {useNavigate} from "react-router-dom";

function App() {
  const navigate =  useNavigate()

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
                navigate(appState?.returnTo)
               }
           }}
       >
         <CssBaseline />
         <Layout />
       </Auth0Provider>
   )
}

export default App
