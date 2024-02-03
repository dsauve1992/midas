import { useQuery } from "react-query";
import { UseQueryResult } from "react-query/types/react/types";
import { ScreenerClient } from "../../../api/ScreenerClient.ts";
import { useApiClientInstance } from "../../../api/useApiClient.ts";
import { SectorTickerCollection } from "../../domain/NestedTickerCollection.ts";

export const useScreener = (): UseQueryResult<SectorTickerCollection[]> => {
  const instance = useApiClientInstance(ScreenerClient);

  return {
    ...useQuery<SectorTickerCollection[]>([`new-screener`], () =>
      instance.queryHierarchy(),
    ),
  };
};
