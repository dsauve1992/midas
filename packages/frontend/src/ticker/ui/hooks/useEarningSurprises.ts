import { useQuery } from "react-query";
import { StockClient } from "../../../api/StockClient.ts";
import { useApiClientInstance } from "../../../api/useApiClient.ts";

export const useEarningSurprises = (symbol: string) => {
  const instance = useApiClientInstance(StockClient);

  return useQuery(["earning-surprises", symbol], () =>
    instance.getEarningsSurprises(symbol),
  );
};
