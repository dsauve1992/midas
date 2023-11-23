import { useGetWatchlist } from "./hooks/useGetWatchlist.ts";
import { useMemo } from "react";

import { IconButton } from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useAddSymbolToWatchlist } from "./hooks/useAddSymbolToWatchlist.ts";
import { useRemoveSymbolFromWatchlist } from "./hooks/useRemoveSymbolWatchlist.ts";
import { toast } from "react-toastify";

export type WatchlistToggleButtonProps = {
  symbol: string;
};
export const WatchlistToggleButton = ({
  symbol,
}: WatchlistToggleButtonProps) => {
  const { data: symbols } = useGetWatchlist();
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

  const isInWatchlist = useMemo(
    () => symbols?.includes(symbol),
    [symbol, symbols],
  );

  return (
    <IconButton onClick={() => (isInWatchlist ? remove(symbol) : add(symbol))}>
      {isInWatchlist ? <RemoveRedEyeIcon /> : <RemoveRedEyeOutlinedIcon />}
    </IconButton>
  );
};
