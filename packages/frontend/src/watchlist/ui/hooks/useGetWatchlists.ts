import { useApiClientInstance } from "../../../api/useApiClient.ts";
import { WatchlistClient } from "../../../api/WatchlistClient.ts";
import { useQuery } from "react-query";
import { WatchlistDto } from "backend/src/shared-types/watchlist.dto";

export const useGetWatchlists = () => {
  const instance = useApiClientInstance(WatchlistClient);

  return useQuery<WatchlistDto[]>(["watchlist"], () => instance.getAll());
};
