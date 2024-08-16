import { Box, Grid, Typography } from "@mui/material";
import { PageLayout } from "../../../lib/ui/global/PageLayout.tsx";
import TradingViewSimpleDailyTapeCardWidget from "../../../lib/ui/chart/TradingViewSimpleDailyTapeCardWidget.tsx";
import TradingViewTickerWidget from "../../../lib/ui/chart/TradingViewTicketWidget.tsx";
import { useWatchlists } from "../../../watchlist/ui/hooks/useWatchlists.ts";
import { LoadOnViewportEnter } from "../../../lib/ui/utils/LoadOnViewportEnter.tsx";

export const DashboardPage = () => {
  return (
    <PageLayout>
      <Grid container spacing={2} flexGrow={1} height={"100%"}>
        <Grid
          item
          xs={3}
          height={"100%"}
          overflow={"scroll"}
          paddingRight={"10px"}
        >
          <QuickAccessWatchlist />
        </Grid>
        <Grid item xs={9} display={"flex"} flexDirection={"column"} gap={2}>
          <MarketView />
        </Grid>
      </Grid>
    </PageLayout>
  );
};

const QuickAccessWatchlist = () => {
  const { watchlists } = useWatchlists();
  return (
    <Box display={"flex"} flexDirection={"column"} gap={2}>
      {watchlists?.map(({ id, name, symbols }) => (
        <Box key={id}>
          <Typography>{name}</Typography>
          {symbols.map((symbol) => (
            <LoadOnViewportEnter
              key={symbol}
              render={() => <TradingViewTickerWidget symbol={symbol} />}
            />
          ))}
        </Box>
      ))}
    </Box>
  );
};

const MarketView = () => {
  return (
    <>
      <Box flexGrow={1}>
        <TradingViewSimpleDailyTapeCardWidget symbol={"SPY"} />
      </Box>
      <Box flexGrow={1}>
        <TradingViewSimpleDailyTapeCardWidget symbol={"QQQ"} />
      </Box>
    </>
  );
};
