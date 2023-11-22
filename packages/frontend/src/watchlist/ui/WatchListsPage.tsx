import { Card, CardContent, Grid, List } from "@mui/material";
import { TickerProfile } from "../../ticker/ui/TickerPage/header/TickerProfile";
import VitalSection from "../../ticker/ui/TickerPage/header/vital/VitalSection";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCard";

export const WatchListsPage = () => {
  return (
    <List>
      {["AAPL", "TSLA", "POWL", "CLFD"].map((el) => (
        <WatchListTicker symbol={el} key={el} />
      ))}
    </List>
  );
};

export const WatchListTicker = ({ symbol }: { symbol: string }) => {
  return (
    <Card>
      <CardContent sx={{ height: "450px" }}>
        <Grid container spacing={2} height="100%" alignItems="center">
          <Grid item xs={3} justifyContent="center">
            <TickerProfile symbol={symbol} />
          </Grid>
          <Grid item xs={3}>
            <VitalSection symbol={symbol} itemCol={12} size="sm" />
          </Grid>
          <Grid item xs={6} height="100%">
            <TradingViewTapeCard symbol={symbol} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
