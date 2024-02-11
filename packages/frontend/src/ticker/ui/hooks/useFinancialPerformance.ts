import { useIncomeStatement } from "./useIncomeStatement.ts";
import FinancialPeriod from "../../../lib/FinancialPeriod.ts";
import { useMemo } from "react";
import { MetricComparison } from "../TickerPage/old/sections/IncomeStatement/MetricComparisonChart.tsx";

type UseFinancialPerformanceProps = {
  symbol: string;
  period: FinancialPeriod;
};

export type StatementSpecQuarterHistory = {
  earnings: MetricComparison[];
  revenues: MetricComparison[];
};

export const useFinancialPerformance = ({
  symbol,
  period,
}: UseFinancialPerformanceProps) => {
  const { data } = useIncomeStatement(symbol, period);

  return useMemo<StatementSpecQuarterHistory>(() => {
    const lastQuarters = (data ?? []).slice(0, 4);

    return {
      earnings: lastQuarters
        .map(({ period, earnings }) => ({
          period,
          ...earnings,
        }))
        .reverse(),
      revenues: lastQuarters
        .map(({ period, sales }) => ({
          period,
          ...sales,
        }))
        .reverse(),
    };
  }, [data]);
};
