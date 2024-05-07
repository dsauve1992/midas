import { Box, Typography } from "@mui/material";
import { WatchlistToggleButton } from "../../watchlist/ui/WatchlistToggleButton.tsx";
import { ScreenerEntryFrontendDto } from "backend/src/shared-types/screener-entry-frontend.dto.ts";
import { useRef } from "react";
import { useInViewport } from "react-in-viewport";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCard.tsx";
import { TicketDetailButton } from "./TicketDetailButton.tsx";

export interface StockScreenerTapeCardProps {
  ticker: ScreenerEntryFrontendDto;
}

export const TickerCard = ({ ticker }: StockScreenerTapeCardProps) => {
  const { exchange, symbol, averageDailyRange } = ticker;

  const ref = useRef(null);
  const { enterCount } = useInViewport(ref);

  return (
    <Box marginBottom="40px">
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        flexDirection="row"
        marginBottom="5px"
      >
        <Box
          display={"inline-flex"}
          flexDirection={"row"}
          alignItems={"end"}
          gap={1}
        >
          <Typography display="inline-block" variant={"h5"}>
            {symbol}
          </Typography>
          <Typography display="inline-block" variant={"subtitle1"}>
            {averageDailyRange.toFixed(2)}%
          </Typography>
          <TicketDetailButton symbol={symbol} />
        </Box>
        <WatchlistToggleButton symbol={symbol} />
      </Box>
      <Box height={"600px"} ref={ref}>
        {enterCount && (
          <Box height={"100%"}>
            <TradingViewTapeCard
              symbol={`${exchange}:${symbol}`}
              withDateRanges={true}
              interval={"D"}
              range={"6m"}
              hideTopToolbar
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
