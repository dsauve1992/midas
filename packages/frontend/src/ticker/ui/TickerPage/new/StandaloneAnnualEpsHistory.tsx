import { useAnnualIncomeStatementWithEstimates } from "../../hooks/useIncomeStatement.ts";
import { useMemo } from "react";
import { AnnualEpsHistory } from "./AnnualEpsHistory.tsx";

type Props = {
  symbol: string;
  position: "vertical" | "horizontal";
};

export const StandaloneAnnualEpsHistory = ({ symbol, position }: Props) => {
  const { data: history } = useAnnualIncomeStatementWithEstimates(symbol!);

  const mem = useMemo(() => {
    const data = (history || []).map(({ period, earnings, estimate }) => {
      return {
        year: +period,
        value: earnings!.current!,
        growth: earnings!.growth!,
        estimate: estimate,
      };
    });
    return position === "vertical" ? data : data.reverse();
  }, [history, position]);

  return <AnnualEpsHistory history={mem} position={position} />;
};
