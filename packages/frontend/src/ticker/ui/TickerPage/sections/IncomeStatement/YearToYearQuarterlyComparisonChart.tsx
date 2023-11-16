import React from "react";
import { Grid } from "@mui/material";
import { MetricComparisonChart } from "./MetricComparisonChart";
import { useFinancialPerformance } from "../../../hooks/useFinancialPerformance.ts";
import FinancialPeriod from "../../../../../lib/FinancialPeriod.ts";

export interface Props {
  symbol: string;
}

const YearToYearQuarterlyComparisonChart: React.FunctionComponent<Props> = ({
  symbol,
}: Props) => {
  const { earnings, revenues } = useFinancialPerformance({
    symbol,
    period: FinancialPeriod.QUARTER,
  });

  return (
    <Grid container spacing={2} height="100%">
      <Grid item xs={6}>
        <MetricComparisonChart title="E.P.S" data={earnings} />
      </Grid>
      <Grid item xs={6}>
        <MetricComparisonChart title="Revenue" data={revenues} />
      </Grid>
    </Grid>
  );
};

export default YearToYearQuarterlyComparisonChart;
