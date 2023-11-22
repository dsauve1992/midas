import { Button, Card, CardContent, Grid, List } from "@mui/material";
import { TickerProfile } from "../../ticker/ui/TickerPage/header/TickerProfile";
import VitalSection from "../../ticker/ui/TickerPage/header/vital/VitalSection";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCard";
import {
  useAddSymbolToWatchlist,
  useGetWatchlist,
  useRemoveSymbolFromWatchlist,
} from "./useWatchlist.ts";

export const WatchListsPage = () => {
  const { data: symbols } = useGetWatchlist();
  const { add } = useAddSymbolToWatchlist({});
  const { remove } = useRemoveSymbolFromWatchlist({});

  return (
    <>
      <Button onClick={() => add("AAPL")}>ADD appl</Button>
      <Button onClick={() => remove("AAPL")}>REM appl</Button>
      <List>
        {symbols?.map((el) => <WatchListTicker symbol={el} key={el} />)}
      </List>
    </>
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
