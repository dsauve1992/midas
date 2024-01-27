import { Box, Button, Drawer, Typography } from "@mui/material";
import { WatchlistToggleButton } from "../../watchlist/ui/WatchlistToggleButton.tsx";
import { ScreenerEntryEntity } from "backend/src/shared-types/screener-entry.entity";
import { useState } from "react";
import { StandaloneEarningSurprisesChart } from "../../ticker/ui/TickerPage/sections/EarningSurprise/StandaloneEarningSurprisesChart.tsx";
import { StandaloneEpsChart } from "../../ticker/ui/TickerPage/sections/IncomeStatement/StandaloneEpsChart.tsx";
import { StandaloneRevenueChart } from "../../ticker/ui/TickerPage/sections/IncomeStatement/StandaloneRevenueChart.tsx";
import { StandaloneInstitutionalOwnershipHistoryByQuarter } from "../../ticker/ui/TickerPage/sections/InstitutionalHolders/StandaloneInstitutionalOwnershipHistoryByQuarter.tsx";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCard.tsx";

export interface StockScreenerTapeCardProps {
  entry: ScreenerEntryEntity;
}

export const SimpleScreenerEntryCard = ({
  entry,
}: StockScreenerTapeCardProps) => {
  const { exchange, symbol, averageDailyRange } = entry;

  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
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
      <Box height={"600px"}>
        <TradingViewTapeCard
          symbol={`${exchange}:${symbol}`}
          withDateRanges={true}
          interval={"D"}
          range={"3m"}
          hideTopToolbar
        />
      </Box>

      {/*  TODO : découpler le card du drawer*/}
      <Drawer anchor={"right"} open={open} onClose={() => setOpen(!open)}>
        <TickerDetailPanel symbol={symbol} />
      </Drawer>
    </>
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
