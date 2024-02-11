import FinancialPeriod from "../../../../../../lib/FinancialPeriod.ts";
import { StandaloneEpsChart } from "./StandaloneEpsChart.tsx";
import { Grid } from "@mui/material";
import { StandaloneRevenueChart } from "./StandaloneRevenueChart.tsx";

type Props = {
  symbol: string;
  frequency: FinancialPeriod;
};
export const IncomeStatementChart = ({ symbol, frequency }: Props) => {
  if (frequency === FinancialPeriod.QUARTER) {
    return (
      <Grid container spacing={2} height="100%">
        <Grid item xs={6}>
          <StandaloneEpsChart symbol={symbol} />
        </Grid>
        <Grid item xs={6}>
          <StandaloneRevenueChart symbol={symbol} />
        </Grid>
      </Grid>
    );
  }

  return <StandaloneEpsChart symbol={symbol} period={FinancialPeriod.ANNUAL} />;
};
