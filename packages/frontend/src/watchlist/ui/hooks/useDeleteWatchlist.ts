import { useApiClientInstance } from "../../../api/useApiClient.ts";
import { useMutation, useQueryClient } from "react-query";
import { WatchlistClient } from "../../../api/WatchlistClient.ts";

export type useDeleteWatchlistProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const useDeleteWatchlist = ({
  onSuccess,
  onError,
}: useDeleteWatchlistProps) => {
  const client = useQueryClient();
  const instance = useApiClientInstance(WatchlistClient);

  const { mutate, isLoading } = useMutation(
    ({ watchlistId }: { watchlistId: string }) =>
      instance.deleteWatchlist(watchlistId),
    {
      onSuccess: async () => {
        await client.invalidateQueries(["watchlist"]);
        onSuccess?.();
      },
      onError,
    },
  );

  return {
    delete: mutate,
    processing: isLoading,
  };
};
