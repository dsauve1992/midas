import { useQuery } from "react-query";
import { StockClient } from "../../../api/StockClient.ts";
import FinancialPeriod from "../../../lib/FinancialPeriod.ts";
import { FinancialRecordDto } from "backend/src/shared-types/income-statement";
import { useApiClientInstance } from "../../../api/useApiClient.ts";

export const useIncomeStatement = (symbol: string, period: FinancialPeriod) => {
  const instance = useApiClientInstance(StockClient);

  return useQuery<FinancialRecordDto[]>(
    ["income-statement", symbol, period],
    () =>
      period === FinancialPeriod.QUARTER
        ? instance.getQuarterlyIncomeStatement(symbol)
        : instance.getAnnuallyIncomeStatement(symbol),
  );
};

export const useAnnualIncomeStatementWithEstimates = (symbol: string) => {
  const instance = useApiClientInstance(StockClient);

  return useQuery<FinancialRecordDto[]>(
    ["income-statement-with-estimates", symbol],
    () => instance.getAnnuallyIncomeStatementV2(symbol),
  );
};
