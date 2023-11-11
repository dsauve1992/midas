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
           domain="dev-8me3qxit3m8ya2ig.us.auth0.com"
           clientId="AiVDSPDpHHfbUerm7ViaJA36jPrOvKLI"
           authorizationParams={{
              redirect_uri: window.location.origin
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
