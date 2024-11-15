import { useMemo, useRef } from "react";
import { Card, CardContent, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { TicketDetailButton } from "../../screener/ui/TicketDetailButton.tsx";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCardWidget.tsx";
import { WatchlistGlobalToggleButton } from "./toggle-button/WatchlistGlobalToggleButton.tsx";
import { useInViewport } from "react-in-viewport";

export interface WatchListTickerProps {
  symbolExchange: string;
  interval: "D" | "W";
}

export const WatchListTicker = ({
  symbolExchange,
  interval,
}: WatchListTickerProps) => {
  const ref = useRef(null);
  const { enterCount } = useInViewport(ref);

  const { symbol, exchange } = useMemo(() => {
    return {
      symbol: symbolExchange.split(":")[1],
      exchange: symbolExchange.split(":")[0],
    };
  }, [symbolExchange]);

  const movingAverages: { type: "EMA" | "SMA"; length: number }[] =
    useMemo(() => {
      return [
        { type: "EMA", length: 10 },
        { type: "EMA", length: 20 },
        { type: "SMA", length: interval === "D" ? 150 : 30 },
      ];
    }, [interval]);

  return (
    <Card ref={ref}>
      <CardContent>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          marginBottom={1}
        >
          <Box
            display={"inline-flex"}
            flexDirection={"row"}
            alignItems={"end"}
            gap={1}
          >
            <Typography variant="h5">{symbol}</Typography>
            <TicketDetailButton symbol={symbol} />
          </Box>
          <WatchlistGlobalToggleButton symbolExchange={{ symbol, exchange }} />
        </Box>

        <Box height="600px">
          {enterCount > 0 && (
            <TradingViewTapeCard
              symbol={symbol}
              exchange={exchange}
              interval={interval}
              range={"12m"}
              movingAverages={movingAverages}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
