import { useQuery } from "react-query";
import { StockClient } from "../../../api/StockClient.ts";
import { useApiClientInstance } from "../../../api/useApiClient.ts";

export const usePriceTarget = (symbol: string) => {
  const instance = useApiClientInstance(StockClient);

  return useQuery(["price-target", symbol], () =>
    instance.getPriceTarget(symbol),
  );
};
