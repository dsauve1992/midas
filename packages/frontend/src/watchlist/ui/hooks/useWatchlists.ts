import { useGetWatchlists } from "./useGetWatchlists.ts";
import { useAddSymbolToWatchlist } from "./useAddSymbolToWatchlist.ts";
import { toast } from "react-toastify";
import { useRemoveSymbolFromWatchlist } from "./useRemoveSymbolWatchlist.ts";
import { useCreateWatchlist } from "./useCreateWatchlist.ts";
import { useDeleteWatchlist } from "./useDeleteWatchlist.ts";
import { useRenameWatchlist } from "./useRenameWatchlist.ts";

// FIXME we should improve the error/success messages and allow client to override them

export const useWatchlists = () => {
  const { data: watchlists } = useGetWatchlists();

  const { add: addSymbol } = useAddSymbolToWatchlist({
    onSuccess: () => toast.success(`successfully added to your watchlist`),
    onError: () => toast.error("Ouf!"),
  });
  const { remove: removeSymbol } = useRemoveSymbolFromWatchlist({
    onSuccess: () => toast.success(`successfully removed from your watchlist`),
    onError: () => toast.error("Ouf!"),
  });

  const { create } = useCreateWatchlist({
    onSuccess: () => toast.success(`watchlist has been created`),
    onError: () => toast.error("Ouf!"),
  });

  const { delete: deleteWatchlist } = useDeleteWatchlist({
    onSuccess: () => toast.success(`watchlist has been deleted`),
    onError: () => toast.error("Ouf!"),
  });

  const { rename } = useRenameWatchlist({
    onSuccess: () => toast.success(`watchlist has been renamed`),
    onError: () => toast.error("Ouf!"),
  });

  return {
    watchlists,
    addSymbol,
    removeSymbol,
    create,
    delete: deleteWatchlist,
    rename,
  };
};
