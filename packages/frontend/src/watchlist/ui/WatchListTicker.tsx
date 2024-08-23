import { useRef } from "react";
import { useInViewport } from "react-in-viewport";
import { Card, CardContent, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { TicketDetailButton } from "../../screener/ui/TicketDetailButton.tsx";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCardWidget.tsx";
import {
  SymbolExchange,
  WatchlistGlobalToggleButton,
} from "./toggle-button/WatchlistGlobalToggleButton.tsx";

export interface WatchListTickerProps {
  symbolExchange: SymbolExchange;
  interval: "D" | "W";
}

export const WatchListTicker = ({
  symbolExchange,
  interval,
}: WatchListTickerProps) => {
  const ref = useRef(null);
  const { enterCount } = useInViewport(ref);

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
            <Typography variant="h5">{symbolExchange.symbol}</Typography>
            <TicketDetailButton symbol={symbolExchange.symbol} />
          </Box>
          <WatchlistGlobalToggleButton symbolExchange={symbolExchange} />
        </Box>

        <Box height="600px">
          {enterCount > 0 && (
            <TradingViewTapeCard
              symbol={symbolExchange.symbol}
              exchange={symbolExchange.exchange}
              interval={interval}
              range={"60m"}
              movingAverages={[
                { type: "EMA", length: 10 },
                { type: "EMA", length: 20 },
                { type: "SMA", length: interval === "D" ? 150 : 30 },
              ]}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
