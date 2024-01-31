import { useQuery } from "react-query";
import { StockClient } from "../../../api/StockClient.ts";
import { useApiClientInstance } from "../../../api/useApiClient.ts";

export const useAnalystEstimates = (symbol: string) => {
  const instance = useApiClientInstance(StockClient);

  return useQuery(["analyst-estimates", symbol], () =>
    instance.getAnalystEstimates(symbol),
  );
};
