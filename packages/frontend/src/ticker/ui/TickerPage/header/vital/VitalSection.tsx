import React from "react";
import { Grid } from "@mui/material";
import { TechnicalRating } from "./TechnicalRating.tsx";
import { ReturnOnEquity } from "./ReturnOnEquity";
import { OutstandingShares } from "./OutstandingShares";
import { FundamentalRating } from "./FundamentalRating.tsx";
import { useCompanyGeneralInformation } from "../../../hooks/useCompanyGeneralInformation.ts";

export interface Props {
  symbol: string;
  itemCol?: number;
  size?: "sm" | "md";
}

export const VitalSection: React.FunctionComponent<Props> = ({
  symbol,
  itemCol = 6,
  size = "sm",
}: Props) => {
  const { data: profile } = useCompanyGeneralInformation(symbol);

  return (
    <Grid container height={"100%"}>
      <Grid item xs={itemCol}>
        <TechnicalRating size={size} value={profile?.technicalRating} />
      </Grid>
      <Grid item xs={itemCol}>
        <FundamentalRating size={size} value={profile?.fundamentalRating} />
      </Grid>
      <Grid item xs={itemCol}>
        <ReturnOnEquity size={size} value={profile?.returnOnEquity} />
      </Grid>
      <Grid item xs={itemCol}>
        <OutstandingShares size={size} value={profile?.outstandingShares} />
      </Grid>
    </Grid>
  );
};

export default VitalSection;
