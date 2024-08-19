import { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import theme from "../lib/ui/global/theme/mui.theme";
import { PageLayout } from "../lib/ui/global/PageLayout.tsx";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { StockClient } from "../api/StockClient.ts";
import { useApiClientInstance } from "../api/useApiClient.ts";

const useStyles = makeStyles({
  formGroup: {
    width: "100%",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
});

const useRiskManagement = () => {
  const [equity, setEquity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [maximumLossPercentage, setMaximumLossPercentage] =
    useState<number>(0.01);

  const maximumNumberOfShareToBuy = useMemo(() => {
    return Math.floor((equity * maximumLossPercentage) / (price - stopLoss));
  }, [equity, maximumLossPercentage, price, stopLoss]);

  return {
    equity,
    setEquity,
    price,
    setPrice,
    stopLoss,
    setStopLoss,
    maximumLossPercentage,
    setMaximumLossPercentage,
    maximumNumberOfShareToBuy,
  };
};

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

const RiskManagementForm = () => {
  const classes = useStyles();
  const {
    equity,
    setEquity,
    price,
    setPrice,
    stopLoss,
    setStopLoss,
    maximumLossPercentage,
    setMaximumLossPercentage,
    maximumNumberOfShareToBuy,
  } = useRiskManagement();

  return (
    <>
      <FormGroup className={classes.formGroup}>
        <TextField
          fullWidth
          type="number"
          label="Equity"
          value={equity}
          onChange={(e) => setEquity(Number.parseInt(e.target.value, 10))}
        />
      </FormGroup>
      <Box display={"flex"} gap={2}>
        <FormGroup className={classes.formGroup}>
          <TextField
            fullWidth
            type="number"
            label="Price"
            value={price}
            onChange={(e) => setPrice(Number.parseFloat(e.target.value))}
          />
        </FormGroup>
        <FormGroup className={classes.formGroup}>
          <TextField
            fullWidth
            type="number"
            label="Stop Loss"
            value={stopLoss}
            onChange={(e) => setStopLoss(Number.parseFloat(e.target.value))}
          />
        </FormGroup>
      </Box>
      <FormGroup className={classes.formGroup}>
        <TextField
          fullWidth
          type="number"
          label="maximum drawdown"
          value={maximumLossPercentage}
          onChange={(e) =>
            setMaximumLossPercentage(Number.parseFloat(e.target.value))
          }
        />
      </FormGroup>
      <h2>Maximum number of stock : {maximumNumberOfShareToBuy}</h2>
    </>
  );
};
