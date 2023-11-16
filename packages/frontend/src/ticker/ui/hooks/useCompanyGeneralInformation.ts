import { useQuery } from "react-query";
import { StockClient } from "../../../api/StockClient.ts";
import { StockGeneralInformationResponseDto } from "backend/src/shared-types/response.dto";
import { useApiClientInstance } from "../../../api/useApiClient.ts";

export const useCompanyGeneralInformation = (symbol: string) => {
  const instance = useApiClientInstance(StockClient);

  return useQuery<StockGeneralInformationResponseDto>(
    ["company-general-information", { symbol }],
    () => instance.getCompanyGeneralInformation(symbol),
    { notifyOnChangeProps: "tracked" },
  );
};
