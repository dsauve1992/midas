import { useQuery } from "react-query";
import { StockClient } from "../../../api/StockClient.ts";
import { useApiClientInstance } from "../../../api/useApiClient.ts";

export const useInsiderTrading = (symbol: string) => {
  const instance = useApiClientInstance(StockClient);

  return useQuery(["insider-trading", symbol], () =>
    instance.getInsiderTrading(symbol),
  );
};
