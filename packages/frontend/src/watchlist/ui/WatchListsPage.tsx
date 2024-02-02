import { Card, CardContent, Grid, List, Typography } from "@mui/material";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCard";
import { useGetWatchlist } from "./hooks/useGetWatchlist.ts";
import { WatchlistToggleButton } from "./WatchlistToggleButton.tsx";
import Box from "@mui/material/Box";

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
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ height: "100%" }}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Typography variant="h5">{symbol}</Typography>
          <WatchlistToggleButton symbol={symbol} />
        </Box>

        <Grid container spacing={2} height="100%" alignItems="center">
          <Grid item xs={6} height="100%">
            <TradingViewTapeCard symbol={symbol} interval={"D"} range={"3m"} />
          </Grid>
          <Grid item xs={6} height="100%">
            <TradingViewTapeCard symbol={symbol} interval="60" range={"5d"} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
