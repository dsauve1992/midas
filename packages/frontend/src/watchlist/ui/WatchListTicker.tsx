import { useRef } from "react";
import { useInViewport } from "react-in-viewport";
import { Card, CardContent, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { TicketDetailButton } from "../../screener/ui/TicketDetailButton.tsx";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCardWidget.tsx";
import { WatchlistGlobalToggleButton } from "./toggle-button/WatchlistGlobalToggleButton.tsx";

export interface WatchListTickerProps {
  symbol: string;
}

export const WatchListTicker = ({ symbol }: WatchListTickerProps) => {
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
            <Typography variant="h5">{symbol}</Typography>
            <TicketDetailButton symbol={symbol} />
          </Box>
          <WatchlistGlobalToggleButton symbol={symbol} />
        </Box>

        <Box height="600px">
          {enterCount > 0 && (
            <TradingViewTapeCard symbol={symbol} interval={"D"} range={"60m"} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
