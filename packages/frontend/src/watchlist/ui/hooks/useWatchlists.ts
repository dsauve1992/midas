import { useGetWatchlists } from "./useGetWatchlists.ts";
import { useAddSymbolToWatchlist } from "./useAddSymbolToWatchlist.ts";
import { toast } from "react-toastify";
import { useRemoveSymbolFromWatchlist } from "./useRemoveSymbolWatchlist.ts";
import { useCreateWatchlist } from "./useCreateWatchlist.ts";

// FIXME we should improve the error/success messages and allow client to override them

export const useWatchlists = () => {
  const { data: watchlists } = useGetWatchlists();

  const { add } = useAddSymbolToWatchlist({
    onSuccess: () => toast.success(`successfully added to your watchlist`),
    onError: () => toast.error("Ouf!"),
  });
  const { remove } = useRemoveSymbolFromWatchlist({
    onSuccess: () => toast.success(`successfully removed from your watchlist`),
    onError: () => toast.error("Ouf!"),
  });

  const { create } = useCreateWatchlist({
    onSuccess: () => toast.success(`watchlist has been created`),
    onError: () => toast.error("Ouf!"),
  });

  return {
    watchlists,
    addToWatchlist: add,
    removeSymbolFromWatchlist: remove,
    createNewWatchlist: create,
  };
};
