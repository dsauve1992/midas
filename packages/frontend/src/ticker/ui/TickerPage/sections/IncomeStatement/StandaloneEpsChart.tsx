import { useFinancialPerformance } from "../../../hooks/useFinancialPerformance.ts";
import FinancialPeriod from "../../../../../lib/FinancialPeriod.ts";
import { MetricComparisonChart } from "./MetricComparisonChart.tsx";

type Props = {
  symbol: string;
  period?: FinancialPeriod;
};

export const StandaloneEpsChart = ({
  symbol,
  period = FinancialPeriod.QUARTER,
}: Props) => {
  const { earnings } = useFinancialPerformance({
    symbol,
    period,
  });

  return <MetricComparisonChart title="E.P.S" data={earnings} />;
};
