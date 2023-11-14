import {ThemeProvider} from '@mui/material'
import {PropsWithChildren} from 'react'
import {BrowserRouter} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from 'react-query'
import {TradingViewWidgetScriptLoader} from '../TradingViewWidgetScriptLoader'
import darkTheme from "../theme/mui.theme.ts";
import {Auth0Provider} from "@auth0/auth0-react";

export interface Props {}

const queryClient = new QueryClient({
   defaultOptions: {
      queries: {
         notifyOnChangeProps: 'tracked',
         refetchOnWindowFocus: false,
         retry: false,
         staleTime: 60000,
      },
   },
})

const DependencyProvider = ({
   children,
}: PropsWithChildren<Props>) => {
   return (
       <Auth0Provider
           domain={import.meta.env.VITE_AUTH0_DOMAIN}
           clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
           authorizationParams={{
               redirect_uri: window.location.origin,
               audience: `${import.meta.env.VITE_BACKEND_URL}`,
           }}
       >
         <BrowserRouter>
            <QueryClientProvider client={queryClient}>
               {/* <ReactQueryDevtools /> */}
               <ThemeProvider theme={darkTheme}>
                  <TradingViewWidgetScriptLoader>
                     <>{children}</>
                  </TradingViewWidgetScriptLoader>
               </ThemeProvider>
            </QueryClientProvider>
         </BrowserRouter>
       </Auth0Provider>
   )
}

export default DependencyProvider
