import { useCallback, useMemo, useState } from "react";

import { Button, Input, MenuItem, Typography } from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { ToggleButtonTemplate } from "./ToggleButtonTemplate.tsx";
import { useWatchlists } from "../hooks/useWatchlists.ts";

export type WatchlistToggleButtonProps = {
  symbol: string;
};
export const WatchlistGlobalToggleButton = ({
  symbol,
}: WatchlistToggleButtonProps) => {
  const {
    watchlists,
    createNewWatchlist,
    addToWatchlist,
    removeSymbolFromWatchlist,
  } = useWatchlists();

  const isInAnyWatchlist = useMemo(
    () => watchlists?.some((watchlist) => watchlist.symbols.includes(symbol)),
    [symbol, watchlists],
  );

  const isInWatchlist = useCallback(
    (watchlistId: string) =>
      watchlists
        ?.find((watchlist) => watchlist.id === watchlistId)
        ?.symbols.includes(symbol),
    [symbol, watchlists],
  );

  const handleClickWatchlist = useCallback(
    (watchlistId: string) => {
      if (isInWatchlist(watchlistId)) {
        removeSymbolFromWatchlist({ watchlistId: watchlistId, symbol });
      } else {
        addToWatchlist({ watchlistId: watchlistId, symbol });
      }
    },
    [addToWatchlist, isInWatchlist, removeSymbolFromWatchlist, symbol],
  );

  return (
    <ToggleButtonTemplate
      tooltipIcon={
        isInAnyWatchlist ? <RemoveRedEyeIcon /> : <RemoveRedEyeOutlinedIcon />
      }
      menuContent={
        <>
          {watchlists?.map((watchlist) => (
            <MenuItem
              key={watchlist.id}
              onClick={() => handleClickWatchlist(watchlist.id)}
            >
              {isInWatchlist(watchlist.id) ? <StarIcon /> : <StarOutlineIcon />}
              <Typography variant="body1" marginLeft={"20px"}>
                {watchlist.name}
              </Typography>
            </MenuItem>
          ))}
          <CreateWatchlistCompactForm
            onCreate={(name) => createNewWatchlist(name)}
          />
        </>
      }
    />
  );
};

export const CreateWatchlistCompactForm = ({
  onCreate,
}: {
  onCreate: (name: string) => void;
}) => {
  const [displayInput, setDisplayInput] = useState(false);

  return (
    <>
      {displayInput ? (
        <Input
          onKeyUp={(event) => {
            event.stopPropagation();
            event.preventDefault();
            if (event.key === "Enter" && (event.target as any).value) {
              onCreate((event.target as any).value);
              setDisplayInput(false);
            }
          }}
        />
      ) : (
        <Button onClick={() => setDisplayInput(true)}>New Watchlist</Button>
      )}
    </>
  );
};