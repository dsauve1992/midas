import FinancialPeriod from "../../../../../lib/FinancialPeriod";
import YearToYearQuarterlyComparisonChart from "./YearToYearQuarterlyComparisonChart";
import YearlyComparisonChart from "./YearToYearEpsComparisonChart";

type Props = {
  symbol: string;
  frequency: FinancialPeriod;
};
export const IncomeStatementChart = ({ symbol, frequency }: Props) => {
  if (frequency === FinancialPeriod.QUARTER) {
    return <YearToYearQuarterlyComparisonChart symbol={symbol} />;
  }

  return <YearlyComparisonChart symbol={symbol} />;
};
