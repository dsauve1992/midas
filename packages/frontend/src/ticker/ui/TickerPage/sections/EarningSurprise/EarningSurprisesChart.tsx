import type { EarningsSurprise } from "backend/src/shared-types/financial-modeling-prep";
import { MetricComparisonChart } from "../IncomeStatement/MetricComparisonChart.tsx";
import { useMemo } from "react";
import _ from "lodash";
import { computeGrowth } from "../../../../../lib/utils.ts";

type Props = {
  data: EarningsSurprise[];
};
export const EarningSurprisesChart = ({ data }: Props) => {
  const comparisons = useMemo(() => {
    const sortedData = _.sortBy(data, "date", "asc");

    const allComparisons = sortedData.map((entry) => ({
      period: entry.date!,
      current: entry.actualEarningResult,
      previous: entry.estimatedEarning,
      growth: computeGrowth(entry.actualEarningResult, entry.estimatedEarning),
    }));

    if (4 <= allComparisons.length) {
      return allComparisons.slice(-4);
    }

    return allComparisons;
  }, [data]);

  return <MetricComparisonChart title="Earnings Suprises" data={comparisons} />;
};
