import React from "react";
import { MetricComparisonChart } from "./MetricComparisonChart";
import { useFinancialPerformance } from "../../../hooks/useFinancialPerformance.ts";
import FinancialPeriod from "../../../../../lib/FinancialPeriod.ts";

export interface Props {
  symbol: string;
}

const YearToYearEpsComparisonChart: React.FunctionComponent<Props> = ({
  symbol,
}: Props) => {
  const { revenues } = useFinancialPerformance({
    symbol,
    period: FinancialPeriod.ANNUAL,
  });

  return <MetricComparisonChart title="E.P.S" data={revenues} />;
};

export default YearToYearEpsComparisonChart;
