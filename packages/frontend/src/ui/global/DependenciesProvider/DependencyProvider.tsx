import {PropsWithChildren} from 'react'
import {BrowserRouter} from 'react-router-dom'
import {QueryClient, QueryClientProvider} from 'react-query'
import {TradingViewWidgetScriptLoader} from '../TradingViewWidgetScriptLoader'

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
            {/*<ThemeProvider>*/}
               <TradingViewWidgetScriptLoader>
                  <>{children}</>
               </TradingViewWidgetScriptLoader>
            {/*</ThemeProvider>*/}
         </QueryClientProvider>
      </BrowserRouter>
   )
}

export default DependencyProvider
