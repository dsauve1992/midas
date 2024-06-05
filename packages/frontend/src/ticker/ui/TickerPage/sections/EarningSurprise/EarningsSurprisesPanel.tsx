import React from "react";
import { Card, CardContent, Grid } from "@mui/material";
import EarningsSurprisesTable from "./EarningsSurprisesTable.tsx";
import { useEarningSurprises } from "../../../hooks/useEarningSurprises.ts";
import { EarningSurprisesChart } from "./EarningSurprisesChart.tsx";

export interface Props {
  symbol: string;
}

const EarningsSurprisesPanel: React.FunctionComponent<Props> = ({
  symbol,
}: Props) => {
  const { data, isLoading } = useEarningSurprises(symbol);

  if (isLoading) {
    return <p>Please wait...</p>;
  }

  return data ? (
    <Grid container spacing={2}>
      <Grid item xs={12} md={3}>
        <Card style={{ height: "625px" }}>
          <CardContent>
            <EarningsSurprisesTable data={data} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={9}>
        <Card style={{ height: "625px" }}>
          <CardContent style={{ height: "100%" }}>
            <EarningSurprisesChart data={data} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  ) : (
    <p>No Earning surprises data available for {symbol}</p>
  );
};

export default EarningsSurprisesPanel;
