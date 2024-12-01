import { NewScreenerEntryFrontendDto } from "backend/src/shared-types/new-screener-entry-frontend.dto";
import { Box, Grid } from "@mui/material";
import LinearProgress from "@mui/material/LinearProgress";
import { PageLayout } from "../../lib/ui/global/PageLayout.tsx";
import { WatchlistGlobalToggleButton } from "../../watchlist/ui/toggle-button/WatchlistGlobalToggleButton.tsx";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCardWidget.tsx";
import { StandaloneAnnualEpsHistory } from "../../ticker/ui/TickerPage/sections/IncomeStatement/StandaloneAnnualEpsHistory.tsx";
import { StandaloneEpsChart } from "../../ticker/ui/TickerPage/sections/IncomeStatement/StandaloneEpsChart.tsx";
import { StandaloneRevenueChart } from "../../ticker/ui/TickerPage/sections/IncomeStatement/StandaloneRevenueChart.tsx";
import { StandaloneEarningSurprisesChart } from "../../ticker/ui/TickerPage/sections/EarningSurprise/StandaloneEarningSurprisesChart.tsx";
import { useSelection } from "./hooks/useSelection.tsx";

export interface Props {
  tickers: NewScreenerEntryFrontendDto[];
}

export const FocusView = (props: Props) => {
  const { selection, index, total } = useSelection(props.tickers || []);

  return (
    <>
      <Box width={"100%"}>
        <LinearProgress variant="determinate" value={(index / total) * 100} />
      </Box>

      <PageLayout>
        {selection && (
          <Box
            display="flex"
            flexDirection="column"
            width={"100%"}
            height={"100%"}
            gap={1}
          >
            <Box display="flex" flexDirection="row" width={"100%"} gap={"24px"}>
              <WatchlistGlobalToggleButton
                symbolExchange={{
                  symbol: selection.symbol,
                  exchange: selection.exchange,
                }}
              />
            </Box>
            <TradingViewTapeCard
              exchange={selection.exchange}
              symbol={selection.symbol}
              withDateRanges={true}
              interval={"W"}
              movingAverages={[
                { type: "SMA", length: 30 },
                { type: "EMA", length: 20 },
                { type: "EMA", length: 10 },
              ]}
              range={"12m"}
              hideTopToolbar
            />
            <Grid container spacing={1}>
              <Grid item xs={3} height={"20vh"}>
                <StandaloneAnnualEpsHistory
                  symbol={selection.symbol}
                  position={"horizontal"}
                />
              </Grid>
              <Grid item xs={3} height={"20vh"}>
                <StandaloneEpsChart symbol={selection.symbol} />
              </Grid>
              <Grid item xs={3} height={"20vh"}>
                <StandaloneRevenueChart symbol={selection.symbol} />
              </Grid>
              <Grid item xs={3} height={"20vh"}>
                <StandaloneEarningSurprisesChart symbol={selection.symbol} />
              </Grid>
            </Grid>
          </Box>
        )}
      </PageLayout>
    </>
  );
};
