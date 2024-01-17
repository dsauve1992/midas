import TradingViewSimpleDailyTapeCard from "../../lib/ui/chart/TradingViewSimpleDailyTapeCard.tsx";
import { Box, Button, Drawer, Typography } from "@mui/material";
import { WatchlistToggleButton } from "../../watchlist/ui/WatchlistToggleButton.tsx";
import { ScreenerEntryEntity } from "backend/src/shared-types/screener-entry.entity";
import { useState } from "react";
import FinancialPeriod from "../../lib/FinancialPeriod.ts";
import { useFinancialPerformance } from "../../ticker/ui/hooks/useFinancialPerformance.ts";
import { MetricComparisonChart } from "../../ticker/ui/TickerPage/sections/IncomeStatement/MetricComparisonChart.tsx";
import { useEarningSurprises } from "../../ticker/ui/hooks/useEarningSurprises.ts";
import { EarningSurprisesChart } from "../../ticker/ui/TickerPage/sections/EarningSurprise/EarningSurprisesChart.tsx";

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
        <TradingViewSimpleDailyTapeCard symbol={`${exchange}:${symbol}`} />
      </Box>

      {/*  TODO : découpler le card du drawer*/}
      <Drawer anchor={"right"} open={open} onClose={() => setOpen(!open)}>
        <QuickTickerDetail symbol={symbol} />
      </Drawer>
    </>
  );
};

const QuickTickerDetail = (props: { symbol: string }) => {
  const { symbol } = props;

  const { earnings, revenues } = useFinancialPerformance({
    symbol,
    period: FinancialPeriod.QUARTER,
  });

  const { data } = useEarningSurprises(symbol);

  return (
    <Box sx={{ width: 600 }} role="presentation" padding={"20px"}>
      <Box sx={{ height: 250 }} marginBottom="20px">
        <MetricComparisonChart title="E.P.S" data={earnings} />
      </Box>
      <Box sx={{ height: 250 }} marginBottom="20px">
        <MetricComparisonChart title="Revenue" data={revenues} />
      </Box>
      <Box sx={{ height: 250 }} marginBottom="20px">
        {data && <EarningSurprisesChart data={data} />}
      </Box>
    </Box>
  );
};
