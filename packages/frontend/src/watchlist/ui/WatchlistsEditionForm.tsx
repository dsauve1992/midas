import { Box, IconButton, List, ListItem, TextField } from "@mui/material";
import { useWatchlists } from "./hooks/useWatchlists.ts";
import React from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { CreateWatchlistCompactForm } from "./toggle-button/WatchlistGlobalToggleButton.tsx";
import useDebouncedCallback from "../../lib/ui/utils/hooks/useDebounce.ts";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 1,
};

export const WatchlistsEditionForm = () => {
  const {
    watchlists,
    create,
    delete: deleteWatchlist,
    rename,
  } = useWatchlists();

  const debouncedRename = useDebouncedCallback(rename, 200);

  return (
    <Box sx={style}>
      <List component="nav" aria-label="main mailbox folders">
        <CreateWatchlistCompactForm onCreate={create} />
        {watchlists &&
          watchlists.map((watchlist) => (
            <ListItem>
              <TextField
                defaultValue={watchlist.name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  debouncedRename({
                    watchlistId: watchlist.id,
                    name: event.target.value,
                  });
                }}
              />
              <IconButton
                size="small"
                onClick={() => deleteWatchlist({ watchlistId: watchlist.id })}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
      </List>
    </Box>
  );
};
