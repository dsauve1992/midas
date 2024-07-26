import { useApiClientInstance } from "../../../api/useApiClient.ts";
import { useMutation, useQueryClient } from "react-query";
import { WatchlistClient } from "../../../api/WatchlistClient.ts";

export type useCreateWatchlistProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const useCreateWatchlist = ({
  onSuccess,
  onError,
}: useCreateWatchlistProps) => {
  const client = useQueryClient();
  const instance = useApiClientInstance(WatchlistClient);

  const { mutate, isLoading } = useMutation(
    (name: string) => instance.createWatchlist(name),
    {
      onSuccess: async () => {
        await client.invalidateQueries(["watchlist"]);
        onSuccess?.();
      },
      onError,
    },
  );

  return {
    create: mutate,
    processing: isLoading,
  };
};
