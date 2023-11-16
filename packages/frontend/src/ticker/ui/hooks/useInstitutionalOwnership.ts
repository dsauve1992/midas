import { useQuery } from "react-query";
import { StockClient } from "../../../api/StockClient.ts";
import { InstitutionalOwnershipResponse } from "backend/src/shared-types/institutional-ownership";
import { useApiClientInstance } from "../../../api/useApiClient.ts";

export const useInstitutionalOwnership = (symbol: string) => {
  const instance = useApiClientInstance(StockClient);

  return useQuery<InstitutionalOwnershipResponse>(
    ["institutional-ownership", symbol],
    () => instance.getInstitutionalOwnership(symbol),
  );
};
