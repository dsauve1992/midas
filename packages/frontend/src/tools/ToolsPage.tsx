import { useState } from "react";
import { Card, CardContent, FormGroup, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import theme from "../lib/ui/global/theme/mui.theme";
import { PageLayout } from "../lib/ui/global/PageLayout.tsx";

const useStyles = makeStyles({
  formGroup: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(3),
  },
});

export const ToolsPage = () => {
  const classes = useStyles();

  const [equity, setEquity] = useState<number>(0);
  const [price, setPrice] = useState<number>(0);
  const [stopLoss, setStopLoss] = useState<number>(0);
  const [maximumLossPerc, setMaximumLossPerc] = useState<number>(0.01);

  return (
    <PageLayout>
      <Card style={{ marginBottom: "15px" }}>
        <CardContent>
          <FormGroup className={classes.formGroup}>
            <TextField
              type="number"
              label="Equity"
              value={equity}
              onChange={(e) => setEquity(Number.parseInt(e.target.value, 10))}
            />
          </FormGroup>
          <FormGroup className={classes.formGroup}>
            <TextField
              type="number"
              label="Price"
              value={price}
              onChange={(e) => setPrice(Number.parseFloat(e.target.value))}
            />
          </FormGroup>
          <FormGroup className={classes.formGroup}>
            <TextField
              type="number"
              label="Stop Loss"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number.parseFloat(e.target.value))}
            />
          </FormGroup>
          <FormGroup className={classes.formGroup}>
            <TextField
              type="number"
              label="maximum drawdown"
              value={maximumLossPerc}
              onChange={(e) =>
                setMaximumLossPerc(Number.parseFloat(e.target.value))
              }
            />
          </FormGroup>
          <h2>
            Maximum number of stock :{" "}
            {Math.floor((equity * maximumLossPerc) / (price - stopLoss))}
          </h2>
        </CardContent>
      </Card>
    </PageLayout>
  );
};
