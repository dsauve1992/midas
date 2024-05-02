import { useAnnualIncomeStatementWithEstimates } from "../../hooks/useIncomeStatement.ts";
import { useMemo } from "react";
import { AnnualEpsHistory } from "./AnnualEpsHistory.tsx";

type Props = {
  symbol: string;
};

export const StandaloneAnnualEpsHistory = ({ symbol }: Props) => {
  const { data: history } = useAnnualIncomeStatementWithEstimates(symbol!);

  const mem = useMemo(() => {
    return (history || []).map(({ period, earnings, estimate }) => {
      return {
        year: +period,
        value: earnings!.current!,
        growth: earnings!.growth!,
        estimate: estimate,
      };
    });
  }, [history]);

  return <AnnualEpsHistory history={mem} />;
};
