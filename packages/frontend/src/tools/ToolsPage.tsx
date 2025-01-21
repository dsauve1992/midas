import { Card, CardContent, Grid } from "@mui/material";
import { PageLayout } from "../lib/ui/global/PageLayout.tsx";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { StockClient } from "../api/StockClient.ts";
import { useApiClientInstance } from "../api/useApiClient.ts";
import { RiskManagementForm } from "./RiskManagementForm.tsx";

export const ToolsPage = () => {
  const [searchParams] = useSearchParams();
  const instance = useApiClientInstance(StockClient);

  const symbol = searchParams.get("symbol");

  const { data } = useQuery(
    ["realtime-price", symbol],
    () => instance.getRealTimePrice(symbol!),
    {
      enabled: !!symbol,
      refetchIntervalInBackground: true,
      refetchInterval: 5000,
    },
  );

  return (
    <PageLayout>
      <Grid container spacing={2}>
        <Grid item xs={3}>
          <Card style={{ marginBottom: "15px" }}>
            <CardContent>
              <RiskManagementForm />
            </CardContent>
          </Card>
        </Grid>
        <Grid item>
          <h1>{symbol}</h1>
          {data?.fmpLast}
        </Grid>
      </Grid>
    </PageLayout>
  );
};
