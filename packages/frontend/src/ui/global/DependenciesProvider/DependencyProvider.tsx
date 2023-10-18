import {ThemeProvider} from '@mui/material'
import {PropsWithChildren} from 'react'
import {BrowserRouter} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from 'react-query'
import {TradingViewWidgetScriptLoader} from '../TradingViewWidgetScriptLoader'
import darkTheme from "../theme/mui.theme.ts";

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
   )
}

export default DependencyProvider
