import { useApiClientInstance } from "../../../api/useApiClient.ts";
import { WatchlistClient } from "../../../api/WatchlistClient.ts";
import { useMutation, useQueryClient } from "react-query";

export type useAddSymbolToWatchlistProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const useAddSymbolToWatchlist = ({
  onSuccess,
  onError,
}: useAddSymbolToWatchlistProps) => {
  const client = useQueryClient();

  const instance = useApiClientInstance(WatchlistClient);

  const { mutate, isLoading } = useMutation(
    ({ watchlistId, symbol }: { watchlistId: string; symbol: string }) =>
      instance.addSymbol(watchlistId, symbol),
    {
      onSuccess: async () => {
        await client.invalidateQueries(["watchlist"]);
        onSuccess?.();
      },
      onError,
    },
  );

  return {
    add: mutate,
    processing: isLoading,
  };
};
