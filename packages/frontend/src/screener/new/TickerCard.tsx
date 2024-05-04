import { Box, Button, Drawer, Grid, Typography } from "@mui/material";
import { WatchlistToggleButton } from "../../watchlist/ui/WatchlistToggleButton.tsx";
import { ScreenerEntryFrontendDto } from "backend/src/shared-types/screener-entry-frontend.dto.ts";
import { useRef, useState } from "react";
import { StandaloneEarningSurprisesChart } from "../../ticker/ui/TickerPage/old/sections/EarningSurprise/StandaloneEarningSurprisesChart.tsx";
import { StandaloneEpsChart } from "../../ticker/ui/TickerPage/old/sections/IncomeStatement/StandaloneEpsChart.tsx";
import { StandaloneRevenueChart } from "../../ticker/ui/TickerPage/old/sections/IncomeStatement/StandaloneRevenueChart.tsx";
import { StandaloneInstitutionalOwnershipHistoryByQuarter } from "../../ticker/ui/TickerPage/old/sections/InstitutionalHolders/StandaloneInstitutionalOwnershipHistoryByQuarter.tsx";
import { useInViewport } from "react-in-viewport";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCard.tsx";
import { StandaloneAnnualEpsHistory } from "../../ticker/ui/TickerPage/new/StandaloneAnnualEpsHistory.tsx";

export interface StockScreenerTapeCardProps {
  ticker: ScreenerEntryFrontendDto;
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

      <Drawer anchor={"right"} open={open} onClose={() => setOpen(!open)}>
        <TickerDetailPanel symbol={symbol} />
      </Drawer>
    </Box>
  );
};

const TickerDetailPanel = (props: { symbol: string }) => {
  const { symbol } = props;

  return (
    <Box sx={{ width: 1200 }} role="presentation" padding={"20px"}>
      <Grid container spacing={5}>
        <Grid item xs={12} height={"33vh"}>
          <StandaloneAnnualEpsHistory symbol={symbol} position={"vertical"} />
        </Grid>
        <Grid item xs={6} height={"33vh"}>
          <StandaloneEpsChart symbol={symbol} />
        </Grid>
        <Grid item xs={6} height={"33vh"}>
          <StandaloneRevenueChart symbol={symbol} />
        </Grid>
        <Grid item xs={6} height={"33vh"}>
          <StandaloneEarningSurprisesChart symbol={symbol} />
        </Grid>
        <Grid item xs={6} height={"33vh"}>
          <StandaloneInstitutionalOwnershipHistoryByQuarter symbol={symbol} />
        </Grid>
      </Grid>
    </Box>
  );
};
