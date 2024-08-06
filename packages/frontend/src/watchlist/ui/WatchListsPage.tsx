import { Box, List, ListItemButton } from "@mui/material";
import { useGetWatchlists } from "./hooks/useGetWatchlists.ts";
import { Helmet } from "react-helmet";
import { WatchListTicker } from "./WatchListTicker.tsx";
import { makeStyles } from "@mui/styles";
import theme from "../../lib/ui/global/theme/mui.theme.ts";
import { useMemo, useState } from "react";
import { indexOf } from "lodash";

const useStyles = makeStyles({
  watchlistLateralMenu: {
    width: "10%",
    padding: "10px",
    backgroundColor: theme.palette.background.paper,
  },
  watchlist: {
    padding: "0 20px",
    overflow: "scroll",
    flexGrow: 1,
  },
});

export const WatchListsPage = () => {
  const classes = useStyles();
  const { data: watchlists } = useGetWatchlists();

  const [selectedWatchlistIndex, setSelectedWatchlistIndex] =
    useState<number>(0);

  const selectedWatchlist = useMemo(() => {
    return watchlists?.[selectedWatchlistIndex];
  }, [selectedWatchlistIndex, watchlists]);

  return (
    <>
      <Helmet>
        <title>Watchlists - Midas</title>
      </Helmet>

      <Box width={"100%"} display={"flex"} flexDirection="row">
        <Box className={classes.watchlistLateralMenu}>
          <h4>Watchlists</h4>
          <List>
            {watchlists?.map((watchlist) => (
              <ListItemButton
                key={watchlist.id}
                selected={selectedWatchlist?.id === watchlist.id}
                onClick={() =>
                  setSelectedWatchlistIndex(indexOf(watchlists, watchlist))
                }
              >
                {watchlist.name}
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box
          className={classes.watchlist}
          display={"flex"}
          flexDirection="column"
        >
          {selectedWatchlist ? (
            <>
              <h4>{selectedWatchlist.name}</h4>
              <List sx={{ width: "100%" }}>
                {selectedWatchlist.symbols?.map((el) => (
                  <WatchListTicker symbol={el} key={el} />
                ))}
              </List>
            </>
          ) : (
            <p>Please select a watchlist</p>
          )}
        </Box>
      </Box>
    </>
  );
};
