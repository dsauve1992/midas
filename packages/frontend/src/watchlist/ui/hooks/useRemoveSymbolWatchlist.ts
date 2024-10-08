import { useApiClientInstance } from "../../../api/useApiClient.ts";
import { useMutation, useQueryClient } from "react-query";
import { WatchlistClient } from "../../../api/WatchlistClient.ts";

export type useRemoveSymbolFromWatchlistProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const useRemoveSymbolFromWatchlist = ({
  onSuccess,
  onError,
}: useRemoveSymbolFromWatchlistProps) => {
  const client = useQueryClient();
  const instance = useApiClientInstance(WatchlistClient);

  const { mutate, isLoading } = useMutation(
    ({ watchlistId, symbol }: { watchlistId: string; symbol: string }) =>
      instance.removeSymbol(watchlistId, symbol),
    {
      onSuccess: async () => {
        await client.invalidateQueries(["watchlist"]);
        onSuccess?.();
      },
      onError,
    },
  );

  return {
    remove: mutate,
    processing: isLoading,
  };
};
