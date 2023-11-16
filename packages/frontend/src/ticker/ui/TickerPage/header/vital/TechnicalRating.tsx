import VitalCard from "./VitalCard";
import { VitalCardStatus } from "./VitalCardStatus.ts";

export type RelativeStrengthRatingProps = {
  value?: number;
  size?: "sm" | "md";
};

export const TechnicalRating = ({
  value,
  size = "sm",
}: RelativeStrengthRatingProps) => {
  return (
    <VitalCard
      label="Technical Rating"
      size={size}
      status={
        (value || 0) > 60 ? VitalCardStatus.SAFE : VitalCardStatus.WARNING
      }
    >
      {value || "-"}
    </VitalCard>
  );
};
