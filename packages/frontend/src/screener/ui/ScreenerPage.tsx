import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Grid } from "@mui/material";
import { useScreener } from "./hooks/useScreener.ts";
import { Helmet } from "react-helmet";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCard.tsx";
import { StandaloneAnnualEpsHistory } from "../../ticker/ui/TickerPage/sections/IncomeStatement/StandaloneAnnualEpsHistory.tsx";
import { StandaloneEpsChart } from "../../ticker/ui/TickerPage/sections/IncomeStatement/StandaloneEpsChart.tsx";
import { StandaloneRevenueChart } from "../../ticker/ui/TickerPage/sections/IncomeStatement/StandaloneRevenueChart.tsx";
import { StandaloneEarningSurprisesChart } from "../../ticker/ui/TickerPage/sections/EarningSurprise/StandaloneEarningSurprisesChart.tsx";

export interface Props {}

function useSelection<T>(collection: T[]) {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const next = useCallback(() => {
    if (currentIndex < collection.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, collection]);

  const previous = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        previous();
      } else if (event.key === "ArrowRight") {
        next();
      }
    };

    // Attach the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [next, previous]);

  const selection = useMemo(
    () => collection[currentIndex],
    [currentIndex, collection],
  );

  return selection;
}

export const ScreenerPage: React.FunctionComponent<Props> = () => {
  const { data: tickers, isLoading } = useScreener();
  const selection = useSelection(tickers || []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (tickers) {
    return (
      <>
        <Helmet>
          <title>Screener - Midas</title>
        </Helmet>

        <Box display="flex" flexDirection="column" gap={"1px"} width={"100%"}>
          {selection && (
            <Box
              display="flex"
              flexDirection="column"
              paddingLeft={"200px"}
              width={"100%"}
              height={"100%"}
            >
              <TradingViewTapeCard
                symbol={`${selection.exchange}:${selection.symbol}`}
                withDateRanges={true}
                interval={"D"}
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
        </Box>
      </>
    );
  }

  return null;
};

export default ScreenerPage;
