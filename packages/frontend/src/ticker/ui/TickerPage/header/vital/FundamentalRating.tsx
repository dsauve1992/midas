import VitalCard from "./VitalCard";
import { VitalCardStatus } from "./VitalCardStatus.ts";
import { isNumber } from "lodash";

export type FundamentalRatingProps = {
  value?: number;
  size?: "sm" | "md";
};

export const FundamentalRating = ({
  value,
  size = "sm",
}: FundamentalRatingProps) => {
  return (
    <VitalCard
      label="Fundamental Rating"
      size={size}
      status={
        (value || 0) > 65 ? VitalCardStatus.SAFE : VitalCardStatus.WARNING
      }
    >
      {isNumber(value) ? value : "-"}
    </VitalCard>
  );
};
