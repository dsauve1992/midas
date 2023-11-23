import { useApiClientInstance } from "../../../api/useApiClient.ts";
import { WatchlistClient } from "../../../api/WatchlistClient.ts";
import { useQuery } from "react-query";

export const useGetWatchlist = () => {
  const instance = useApiClientInstance(WatchlistClient);

  return useQuery<string[]>(["watchlist"], () => instance.fetch());
};
