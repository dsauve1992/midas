import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, Grid } from "@mui/material";
import { MetricComparisonChart } from "../../ticker/ui/TickerPage/sections/IncomeStatement/MetricComparisonChart";
import { TickerProfile } from "../../ticker/ui/TickerPage/header/TickerProfile";
import TradingViewTapeCard from "../../ui/chart/TradingViewTapeCard";
import VitalSection from "../../ticker/ui/TickerPage/header/vital/VitalSection";
import { useFinancialPerformance } from "../../ticker/ui/hooks/useFinancialPerformance.ts";
import FinancialPeriod from "../../lib/FinancialPeriod.ts";
import Box from "@mui/material/Box";

export interface Props {
  symbol: string;
}

export const ScreenerEntryCard: React.FunctionComponent<Props> = ({
  symbol,
}) => {
  const { earnings, revenues } = useFinancialPerformance({
    symbol,
    period: FinancialPeriod.QUARTER,
  });

  return (
    <Box display={"flex"} flexGrow={1} width={"100%"}>
      <Card sx={{ width: "100%", height: "100%" }}>
        <CardContent sx={{ width: "100%", height: "100%" }}>
          <Grid container spacing={2} height={"100%"}>
            <Grid item xs={4}>
              <Box
                display="flex"
                flexDirection="column"
                gap={"5"}
                height={"100%"}
              >
                <Box display="flex" flexGrow={1} flexDirection="column">
                  <Link to={`/ticker/${symbol}`}>See Detail...</Link>
                  <TickerProfile symbol={symbol} />
                  <VitalSection symbol={symbol} />
                </Box>

                <Box display="flex" flexGrow={2}>
                  {earnings.length && (
                    <MetricComparisonChart
                      key={symbol}
                      title="E.P.S"
                      data={earnings}
                    />
                  )}
                </Box>
                <Box display="flex" flexGrow={2}>
                  {revenues.length && (
                    <MetricComparisonChart
                      title="Revenue"
                      key={symbol}
                      data={revenues}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={8}>
              <TradingViewTapeCard symbol={symbol} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
