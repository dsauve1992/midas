import { useGetWatchlists } from "../hooks/useGetWatchlists.ts";
import { useCallback, useMemo, useState } from "react";

import { Button, Input, MenuItem, Typography } from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

import { useAddSymbolToWatchlist } from "../hooks/useAddSymbolToWatchlist.ts";
import { useRemoveSymbolFromWatchlist } from "../hooks/useRemoveSymbolWatchlist.ts";
import { toast } from "react-toastify";
import { ToggleButtonTemplate } from "./ToggleButtonTemplate.tsx";
import { useCreateWatchlist } from "../hooks/useCreateWatchlist.ts";

export type WatchlistToggleButtonProps = {
  symbol: string;
};
export const WatchlistToggleButton = ({
  symbol,
}: WatchlistToggleButtonProps) => {
  const { data: watchlists } = useGetWatchlists();
  const { add } = useAddSymbolToWatchlist({
    onSuccess: () =>
      toast.success(`${symbol} has been added to your watchlist`),
    onError: () => toast.error("Ouf!"),
  });
  const { remove } = useRemoveSymbolFromWatchlist({
    onSuccess: () =>
      toast.success(`${symbol} has been removed from your watchlist`),
    onError: () => toast.error("Ouf!"),
  });

  const { create } = useCreateWatchlist({
    onSuccess: () => toast.success(`watchlist has been created`),
    onError: () => toast.error("Ouf!"),
  });

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
        remove({ watchlistId: watchlistId, symbol });
      } else {
        add({ watchlistId: watchlistId, symbol });
      }
    },
    [add, isInWatchlist, remove, symbol],
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
          <CreateWatchlistCompactForm onCreate={(name) => create(name)} />
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
