import { useApiClientInstance } from "../../../api/useApiClient.ts";
import { useMutation, useQueryClient } from "react-query";
import { WatchlistClient } from "../../../api/WatchlistClient.ts";

export type useRenameWatchlistProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const useRenameWatchlist = ({
  onSuccess,
  onError,
}: useRenameWatchlistProps) => {
  const client = useQueryClient();
  const instance = useApiClientInstance(WatchlistClient);

  const { mutate, isLoading } = useMutation(
    ({ watchlistId, name }: { watchlistId: string; name: string }) =>
      instance.renameWatchlist(watchlistId, name),
    {
      onSuccess: async () => {
        await client.invalidateQueries(["watchlist"]);
        onSuccess?.();
      },
      onError,
    },
  );

  return {
    rename: mutate,
    processing: isLoading,
  };
};
