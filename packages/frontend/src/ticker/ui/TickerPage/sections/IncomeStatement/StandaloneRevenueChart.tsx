import { useFinancialPerformance } from "../../../hooks/useFinancialPerformance.ts";
import FinancialPeriod from "../../../../../lib/FinancialPeriod.ts";
import { MetricComparisonChart } from "./MetricComparisonChart.tsx";

type Props = {
  symbol: string;
};

export const StandaloneRevenueChart = ({ symbol }: Props) => {
  const { revenues } = useFinancialPerformance({
    symbol,
    period: FinancialPeriod.QUARTER,
  });

  return <MetricComparisonChart title="Revenue" data={revenues} />;
};
