import { useMemo } from "react";
import { useOwnershipHistoryByQuarter } from "../../../hooks/useOwnershipHistoryByQuarter.ts";
import {
  InstitutionalOwnershipHistoryByQuarterBarChart,
  InstitutionalOwnershipHistoryByQuarterDataEntry,
} from "./InstitutionalOwnershipHistoryByQuarterBarChart.tsx";
import { AggregateHolding } from "backend/src/shared-types/institutional-ownership";

interface Props {
  history: AggregateHolding[];
}
export const InstitutionalOwnershipHistoryByQuarter = ({ history }: Props) => {
  const quarters = useOwnershipHistoryByQuarter(history);

  const chartData: InstitutionalOwnershipHistoryByQuarterDataEntry[] = useMemo(
    () =>
      quarters.map(({ periodString, sharesHeld }) => ({
        period: periodString,
        value: sharesHeld,
      })),
    [quarters],
  );

  return <InstitutionalOwnershipHistoryByQuarterBarChart data={chartData} />;
};
