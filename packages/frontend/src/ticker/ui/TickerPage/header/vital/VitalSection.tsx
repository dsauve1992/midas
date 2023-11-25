import React from "react";
import { Grid } from "@mui/material";
import { TechnicalRating } from "./TechnicalRating.tsx";
import { ReturnOnEquity } from "./ReturnOnEquity";
import { OutstandingShares } from "./OutstandingShares";
import { FundamentalRating } from "./FundamentalRating.tsx";
import { StockGeneralInformationResponseDto } from "backend/src/shared-types/response.dto";

export interface Props {
  profile: StockGeneralInformationResponseDto;
  itemCol?: number;
  size?: "sm" | "md";
}

export const VitalSection: React.FunctionComponent<Props> = ({
  profile,
  itemCol = 6,
  size = "sm",
}: Props) => {
  return (
    <Grid container>
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
