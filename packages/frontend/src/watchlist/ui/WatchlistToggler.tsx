import { useGetWatchlist } from "./hooks/useGetWatchlist.ts";
import { useMemo } from "react";

import { IconButton } from "@mui/material";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useAddSymbolToWatchlist } from "./hooks/useAddSymbolToWatchlist.ts";
import { useRemoveSymbolFromWatchlist } from "./hooks/useRemoveSymbolWatchlist.ts";

export type WatchlistTogglerProps = {
  symbol: string;
};
export const WatchlistToggler = ({ symbol }: WatchlistTogglerProps) => {
  const { data: symbols } = useGetWatchlist();
  const { add } = useAddSymbolToWatchlist({});
  const { remove } = useRemoveSymbolFromWatchlist({});

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
