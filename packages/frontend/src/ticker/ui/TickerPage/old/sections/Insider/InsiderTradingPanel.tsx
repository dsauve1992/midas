import React from "react";
import { Grid } from "@mui/material";
import InsiderActivityHistoryTable from "./InsiderActivityHistoryTable.tsx";
import { useInsiderTrading } from "../../../../hooks/useInsiderTrading.ts";
import InsiderActivityHistoryChart from "./InsiderActivityHistoryChart.tsx";

export interface Props {
  symbol: string;
}

const InsiderTradingPanel: React.FunctionComponent<Props> = ({
  symbol,
}: Props) => {
  const { data, isLoading } = useInsiderTrading(symbol);

  if (isLoading) {
    return <p>Please wait...</p>;
  }

  return data?.length ? (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <InsiderActivityHistoryChart events={data} />
      </Grid>
      <Grid item xs={12}>
        <InsiderActivityHistoryTable events={data} />
      </Grid>
    </Grid>
  ) : (
    <p>There is no insider trading data for {symbol}</p>
  );
};

export default InsiderTradingPanel;
