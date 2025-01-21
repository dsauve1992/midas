import { Box, FormGroup, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import theme from "../lib/ui/global/theme/mui.theme.ts";
import { useMemo, useState } from "react";

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

export const RiskManagementForm = () => {
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
