import { Card, CardContent, Grid, List } from "@mui/material";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCard";
import { useGetWatchlist } from "./hooks/useGetWatchlist.ts";

export const WatchListsPage = () => {
  const { data: symbols } = useGetWatchlist();

  return (
    <>
      <List sx={{ width: "100%" }}>
        {symbols?.map((el) => <WatchListTicker symbol={el} key={el} />)}
      </List>
    </>
  );
};

export const WatchListTicker = ({ symbol }: { symbol: string }) => {
  return (
    <Card>
      <CardContent sx={{ height: "600px" }}>
        <Grid container spacing={2} height="100%" alignItems="center">
          <Grid item xs={4} height="100%">
            <TradingViewTapeCard symbol={symbol} interval={"D"} range={"3m"} />
          </Grid>
          <Grid item xs={4} height="100%">
            <TradingViewTapeCard symbol={symbol} interval="60" range={"5d"} />
          </Grid>
          <Grid item xs={4} height="100%">
            <TradingViewTapeCard symbol={symbol} interval={"15"} range={"1d"} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
