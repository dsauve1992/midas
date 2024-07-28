import React from "react";
import { Box } from "@mui/material";
import { useScreener } from "./hooks/useScreener.ts";
import { Helmet } from "react-helmet";
import { TickerCard } from "./TickerCard.tsx";

export interface Props {}

export const ScreenerPage: React.FunctionComponent<Props> = () => {
  const { data: tickers, isLoading } = useScreener();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (tickers) {
    return (
      <>
        <Helmet>
          <title>Screener - Midas</title>
        </Helmet>

        <Box display="flex" flexDirection="column" gap={"10px"} width={"100%"}>
          {tickers.map((ticker) => (
            <TickerCard ticker={ticker} key={ticker.symbol} />
          ))}
        </Box>
      </>
    );
  }

  return null;
};

export default ScreenerPage;
