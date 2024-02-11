import VitalCard from "./VitalCard.tsx";
import { VitalCardStatus } from "./VitalCardStatus.ts";

export type OutstandingSharesProps = {
  value?: number;
  size?: "sm" | "md";
};

export const OutstandingShares = ({
  value,
  size = "md",
}: OutstandingSharesProps) => {
  return (
    <VitalCard
      size={size}
      status={
        (value || 0) < 100000000
          ? VitalCardStatus.SAFE
          : VitalCardStatus.WARNING
      }
      label="Out. Shares"
    >
      {value?.toLocaleString() || "-"}
    </VitalCard>
  );
};
