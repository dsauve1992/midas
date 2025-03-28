import {
  Box,
  Chip,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  Modal,
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
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { WatchlistsEditionForm } from "./WatchlistsEditionForm.tsx";
import { TransitionGroup } from "react-transition-group";

const useStyles = makeStyles({
  watchlistLateralMenu: {
    minWidth: "100px",
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
  const [interval, setInterval] = useState<"D" | "W">("W");

  const [selectedWatchlistIndex, setSelectedWatchlistIndex] =
    useState<number>(0);

  const [modalOpen, setModalOpen] = useState(false);

  const selectedWatchlist = useMemo(() => {
    return watchlists?.[selectedWatchlistIndex];
  }, [selectedWatchlistIndex, watchlists]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  return (
    <>
      <Helmet>
        <title>Watchlists - Midas</title>
      </Helmet>

      <PageLayout>
        <Box
          width={"100%"}
          height={"100%"}
          display={"flex"}
          flexDirection="row"
        >
          <Box className={classes.watchlistLateralMenu}>
            <Box display="flex" flexDirection="row">
              <Typography variant="h6">Watchlists</Typography>
              <IconButton onClick={handleOpenModal} size="small" sx={{ ml: 2 }}>
                <ModeEditIcon />
              </IconButton>
            </Box>
            <List>
              {watchlists?.map((watchlist) => (
                <ListItemButton
                  sx={{ p: 1 }}
                  key={watchlist.id}
                  selected={selectedWatchlist?.id === watchlist.id}
                  onClick={() =>
                    setSelectedWatchlistIndex(indexOf(watchlists, watchlist))
                  }
                >
                  <Box
                    display="flex"
                    flexDirection="row"
                    width="100%"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="subtitle2">
                      {watchlist.name}
                    </Typography>

                    <Chip
                      style={{ marginLeft: "5px" }}
                      label={watchlist.symbols.length}
                    />
                  </Box>
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
              <Box
                display="flex"
                gap={"10px"}
                height={"100%"}
                flexDirection="column"
              >
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
                    <TransitionGroup>
                      {selectedWatchlist.symbols?.map((el) => (
                        <Collapse key={el} timeout={500}>
                          <WatchListTicker
                            symbolExchange={el}
                            interval={interval}
                          />
                        </Collapse>
                      ))}
                    </TransitionGroup>
                  </List>
                </Box>
              </Box>
            ) : (
              <p>Please select a watchlist</p>
            )}
          </Box>
        </Box>

        <Modal open={modalOpen} onClose={handleCloseModal}>
          <WatchlistsEditionForm />
        </Modal>
      </PageLayout>
    </>
  );
};
