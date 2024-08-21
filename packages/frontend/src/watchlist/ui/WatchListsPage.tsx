import {
  Box,
  Chip,
  List,
  ListItemButton,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useGetWatchlists } from "./hooks/useGetWatchlists.ts";
import { Helmet } from "react-helmet";
import { WatchListTicker } from "./WatchListTicker.tsx";
import { makeStyles } from "@mui/styles";
import theme from "../../lib/ui/global/theme/mui.theme.ts";
import { useMemo, useState } from "react";
import { indexOf } from "lodash";
import { PageLayout } from "../../lib/ui/global/PageLayout.tsx";

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
  const [interval, setInterval] = useState<"D" | "W">("D");

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

      <PageLayout>
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

                  <Chip
                    style={{ marginLeft: "5px" }}
                    label={watchlist.symbols.length}
                  />
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
                <Typography variant="h5">{selectedWatchlist.name}</Typography>
                <ToggleButtonGroup
                  value={interval}
                  exclusive
                  size={"small"}
                  onChange={(_, value) => setInterval(value)}
                >
                  <ToggleButton value="D" aria-label="left aligned">
                    Daily
                  </ToggleButton>
                  <ToggleButton value="W" aria-label="centered">
                    Weekly
                  </ToggleButton>
                </ToggleButtonGroup>
                <Box overflow="scroll">
                  <List sx={{ width: "100%" }}>
                    {selectedWatchlist.symbols?.map((el) => (
                      <WatchListTicker
                        symbol={el}
                        key={el}
                        interval={interval}
                      />
                    ))}
                  </List>
                </Box>
              </>
            ) : (
              <p>Please select a watchlist</p>
            )}
          </Box>
        </Box>
      </PageLayout>
    </>
  );
};
