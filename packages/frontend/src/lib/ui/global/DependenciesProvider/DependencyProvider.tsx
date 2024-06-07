import { ThemeProvider } from "@mui/material";
import { PropsWithChildren } from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { TradingViewWidgetScriptLoader } from "../TradingViewWidgetScriptLoader.tsx";
import darkTheme from "../theme/mui.theme.ts";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

export interface Props {}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      notifyOnChangeProps: "tracked",
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 60000,
    },
  },
});

const DependencyProvider = ({ children }: PropsWithChildren<Props>) => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools /> */}
        <ThemeProvider theme={darkTheme}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <TradingViewWidgetScriptLoader>
              <>{children}</>
            </TradingViewWidgetScriptLoader>
          </LocalizationProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default DependencyProvider;
