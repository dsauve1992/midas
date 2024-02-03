import { Box, Button, Drawer, Grid, Typography } from "@mui/material";
import { WatchlistToggleButton } from "../../watchlist/ui/WatchlistToggleButton.tsx";
import { ScreenerEntryEntity } from "backend/src/shared-types/screener-entry.entity";
import { useRef, useState } from "react";
import { StandaloneEarningSurprisesChart } from "../../ticker/ui/TickerPage/sections/EarningSurprise/StandaloneEarningSurprisesChart.tsx";
import { StandaloneEpsChart } from "../../ticker/ui/TickerPage/sections/IncomeStatement/StandaloneEpsChart.tsx";
import { StandaloneRevenueChart } from "../../ticker/ui/TickerPage/sections/IncomeStatement/StandaloneRevenueChart.tsx";
import { StandaloneInstitutionalOwnershipHistoryByQuarter } from "../../ticker/ui/TickerPage/sections/InstitutionalHolders/StandaloneInstitutionalOwnershipHistoryByQuarter.tsx";
import { useInViewport } from "react-in-viewport";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCard.tsx";

export interface StockScreenerTapeCardProps {
  ticker: ScreenerEntryEntity;
}

export const TickerCard = ({ ticker }: StockScreenerTapeCardProps) => {
  const { exchange, symbol, averageDailyRange } = ticker;

  const [open, setOpen] = useState<boolean>(false);

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
          <Button
            size="small"
            variant="contained"
            onClick={() => setOpen(true)}
          >
            Detail
          </Button>
        </Box>
        <WatchlistToggleButton symbol={symbol} />
      </Box>
      <Box height={"600px"} ref={ref}>
        {enterCount && (
          <Grid container height={"100%"}>
            <Grid item xs={6}>
              <TradingViewTapeCard
                symbol={`${exchange}:${symbol}`}
                withDateRanges={true}
                interval={"D"}
                range={"3m"}
                hideTopToolbar
              />
            </Grid>
            <Grid item xs={6}>
              <TradingViewTapeCard
                symbol={`${exchange}:${symbol}`}
                withDateRanges={true}
                interval={"60"}
                range={"5d"}
                hideTopToolbar
              />
            </Grid>
          </Grid>
        )}
      </Box>

      <Drawer anchor={"right"} open={open} onClose={() => setOpen(!open)}>
        <TickerDetailPanel symbol={symbol} />
      </Drawer>
    </Box>
  );
};

const TickerDetailPanel = (props: { symbol: string }) => {
  const { symbol } = props;

  return (
    <Box sx={{ width: 600 }} role="presentation" padding={"20px"}>
      <Box sx={{ height: 250 }} marginBottom="20px">
        <StandaloneEpsChart symbol={symbol} />
      </Box>
      <Box sx={{ height: 250 }} marginBottom="20px">
        <StandaloneRevenueChart symbol={symbol} />
      </Box>
      <Box sx={{ height: 250 }} marginBottom="20px">
        <StandaloneEarningSurprisesChart symbol={symbol} />
      </Box>
      <Box sx={{ height: 250 }} marginBottom="20px">
        <StandaloneInstitutionalOwnershipHistoryByQuarter symbol={symbol} />
      </Box>
    </Box>
  );
};
