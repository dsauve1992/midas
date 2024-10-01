import React from "react";
import { Box, Chip, Grid } from "@mui/material";
import { useScreener } from "./hooks/useScreener.ts";
import { Helmet } from "react-helmet";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCardWidget.tsx";
import { StandaloneAnnualEpsHistory } from "../../ticker/ui/TickerPage/sections/IncomeStatement/StandaloneAnnualEpsHistory.tsx";
import { StandaloneEpsChart } from "../../ticker/ui/TickerPage/sections/IncomeStatement/StandaloneEpsChart.tsx";
import { StandaloneRevenueChart } from "../../ticker/ui/TickerPage/sections/IncomeStatement/StandaloneRevenueChart.tsx";
import { StandaloneEarningSurprisesChart } from "../../ticker/ui/TickerPage/sections/EarningSurprise/StandaloneEarningSurprisesChart.tsx";
import { useSelection } from "./hooks/useSelection.tsx";
import { WatchlistGlobalToggleButton } from "../../watchlist/ui/toggle-button/WatchlistGlobalToggleButton.tsx";
import { PageLayout } from "../../lib/ui/global/PageLayout.tsx";
import LinearProgress from "@mui/material/LinearProgress";

export interface Props {}

export const ScreenerPage: React.FunctionComponent<Props> = () => {
  const { data: tickers, isLoading } = useScreener();
  const { selection, index, total } = useSelection(tickers || []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (tickers) {
    return (
      <Box display={"flex"} flexDirection={"column"} width={"100%"}>
        <Helmet>
          <title>Screener - Midas</title>
        </Helmet>
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
            >
              <Box
                display="flex"
                flexDirection="row"
                width={"100%"}
                gap={"24px"}
              >
                <WatchlistGlobalToggleButton
                  symbolExchange={{
                    symbol: selection.symbol,
                    exchange: selection.exchange,
                  }}
                />
                {(selection.labels || []).map((label) => (
                  <Chip label={`${label.title} : ${label.description}`} />
                ))}
              </Box>
              <TradingViewTapeCard
                exchange={selection.exchange}
                symbol={selection.symbol}
                withDateRanges={true}
                interval={"W"}
                movingAverages={[{ type: "SMA", length: 30 }]}
                range={"60m"}
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
      </Box>
    );
  }

  return null;
};

export default ScreenerPage;
