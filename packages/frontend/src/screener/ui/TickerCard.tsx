import { Box, Typography } from "@mui/material";
import { WatchlistGlobalToggleButton } from "../../watchlist/ui/toggle-button/WatchlistGlobalToggleButton.tsx";
import { useRef } from "react";
import { useInViewport } from "react-in-viewport";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCardWidget.tsx";
import { TicketDetailButton } from "./TicketDetailButton.tsx";
import { NewScreenerEntryFrontendDto } from "backend/src/shared-types/new-screener-entry-frontend.dto";

export interface StockScreenerTapeCardProps {
  ticker: NewScreenerEntryFrontendDto;
}

export const TickerCard = ({ ticker }: StockScreenerTapeCardProps) => {
  const { exchange, symbol } = ticker;

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
          <TicketDetailButton symbol={symbol} />
        </Box>
        <WatchlistGlobalToggleButton
          symbolExchange={{
            symbol: symbol,
            exchange: exchange,
          }}
        />
      </Box>
      <Box height={"600px"} ref={ref}>
        {enterCount && (
          <Box height={"100%"}>
            <TradingViewTapeCard
              exchange={exchange}
              symbol={symbol}
              withDateRanges={true}
              interval={"D"}
              range={"12m"}
              hideTopToolbar
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};
