import React from "react";
import { Card, CardContent, Grid, IconButton } from "@mui/material";
import { MetricComparisonChart } from "../../ticker/ui/TickerPage/sections/IncomeStatement/MetricComparisonChart";
import { TickerProfile } from "../../ticker/ui/TickerPage/header/TickerProfile";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCard";
import { useFinancialPerformance } from "../../ticker/ui/hooks/useFinancialPerformance.ts";
import FinancialPeriod from "../../lib/FinancialPeriod.ts";
import Box from "@mui/material/Box";
import { useCompanyGeneralInformation } from "../../ticker/ui/hooks/useCompanyGeneralInformation.ts";
import { LoadingBox } from "../../lib/ui/global/component/LoadingBox.tsx";
import InfoIcon from "@mui/icons-material/Info";
import { FundamentalRating } from "../../ticker/ui/TickerPage/header/vital/FundamentalRating.tsx";
import { ReturnOnEquity } from "../../ticker/ui/TickerPage/header/vital/ReturnOnEquity.tsx";

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

  const { isLoading: profileLoading, data: profile } =
    useCompanyGeneralInformation(symbol!);

  const cardContent = profileLoading ? (
    <LoadingBox />
  ) : (
    <Grid container spacing={2} height={"100%"}>
      <Grid item xs={4}>
        <Box display="flex" flexDirection="column" gap={"100"} height={"100%"}>
          <Box display="flex" flexGrow={1} flexDirection="column">
            <Box display="flex" justifyContent="center">
              <IconButton aria-label={"detail"} href={`/ticker/${symbol}`}>
                <InfoIcon />
              </IconButton>
            </Box>
            <TickerProfile profile={profile!} />
            <Grid container>
              <Grid item xs={6}>
                <FundamentalRating
                  size={"sm"}
                  value={profile?.fundamentalRating}
                />
              </Grid>
              <Grid item xs={6}>
                <ReturnOnEquity size={"sm"} value={profile?.returnOnEquity} />
              </Grid>
            </Grid>
          </Box>
          <Box display="flex" flexGrow={2} paddingY={"10px"}>
            {earnings.length && (
              <MetricComparisonChart
                title="E.P.S"
                key={symbol}
                data={earnings}
              />
            )}
          </Box>
          <Box display="flex" flexGrow={2} paddingY={"10px"}>
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
  );

  return (
    <Box display={"flex"} flexGrow={1} width={"100%"}>
      <Card sx={{ width: "100%", height: "100%" }}>
        <CardContent sx={{ width: "100%", height: "100%" }}>
          {cardContent}
        </CardContent>
      </Card>
    </Box>
  );
};
