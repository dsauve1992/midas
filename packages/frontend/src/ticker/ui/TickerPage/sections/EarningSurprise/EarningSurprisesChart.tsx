import { useEarningSurprisesComparison } from "./hooks/useEarningSurprisesComparison";
import type { EarningsSurprise } from "backend/src/shared-types/financial-modeling-prep";
import { MetricComparisonChart } from "../IncomeStatement/MetricComparisonChart";

type Props = {
  data: EarningsSurprise[];
};
export const EarningSurprisesChart = ({ data }: Props) => {
  const comparisons = useEarningSurprisesComparison(data, 4);

  return <MetricComparisonChart title="Earnings Suprises" data={comparisons} />;
};
