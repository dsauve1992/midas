import { useApiClientInstance } from "../../api/useApiClient.ts";
import { useMutation, useQuery } from "react-query";
import { WatchlistClient } from "../../api/WatchlistClient.ts";

export const useGetWatchlist = () => {
  const instance = useApiClientInstance(WatchlistClient);

  return useQuery<string[]>(["watchlist"], () => instance.fetch());
};

export type MutationFeedBack = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const useAddSymbolToWatchlist = ({
  onSuccess,
  onError,
}: MutationFeedBack) => {
  const instance = useApiClientInstance(WatchlistClient);

  const { mutate, isLoading } = useMutation(
    (symbol: string) => instance.addSymbol(symbol),
    {
      onSuccess,
      onError,
    },
  );

  return {
    add: mutate,
    processing: isLoading,
  };
};

export const useRemoveSymbolFromWatchlist = ({
  onSuccess,
  onError,
}: MutationFeedBack) => {
  const instance = useApiClientInstance(WatchlistClient);

  const { mutate, isLoading } = useMutation(
    (symbol: string) => instance.removeSymbol(symbol),
    {
      onSuccess,
      onError,
    },
  );

  return {
    remove: mutate,
    processing: isLoading,
  };
};
