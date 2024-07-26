import { Card, CardContent, Grid, List, Typography } from "@mui/material";
import TradingViewTapeCard from "../../lib/ui/chart/TradingViewTapeCard";
import { useGetWatchlists } from "./hooks/useGetWatchlists.ts";
import { WatchlistToggleButton } from "./toggle-button/WatchlistToggleButton.tsx";
import Box from "@mui/material/Box";
import { useRef } from "react";
import { useInViewport } from "react-in-viewport";
import { Helmet } from "react-helmet";
import { TicketDetailButton } from "../../screener/new/TicketDetailButton.tsx";

export const WatchListsPage = () => {
  const { data: watchlists } = useGetWatchlists();
  return (
    <>
      <Helmet>
        <title>Watchlists - Midas</title>
      </Helmet>

      {watchlists?.map((watchlist) => (
        <>
          <h4>{watchlist.name}</h4>
          <List sx={{ width: "100%" }}>
            {watchlist.symbols?.map((el) => (
              <WatchListTicker symbol={el} key={el} />
            ))}
          </List>

          <br />
        </>
      ))}
    </>
  );
};

export const WatchListTicker = ({ symbol }: { symbol: string }) => {
  const ref = useRef(null);
  const { enterCount } = useInViewport(ref);

  return (
    <Card ref={ref}>
      <CardContent>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          marginBottom={1}
        >
          <Box
            display={"inline-flex"}
            flexDirection={"row"}
            alignItems={"end"}
            gap={1}
          >
            <Typography variant="h5">{symbol}</Typography>
            <TicketDetailButton symbol={symbol} />
          </Box>
          <WatchlistToggleButton symbol={symbol} />
        </Box>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={6} height="600px">
            {enterCount > 0 && (
              <TradingViewTapeCard
                symbol={symbol}
                interval={"D"}
                range={"3m"}
              />
            )}
          </Grid>
          <Grid item xs={6} height="600px">
            {enterCount > 0 && (
              <TradingViewTapeCard
                symbol={symbol}
                interval={"60"}
                range={"5d"}
              />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
