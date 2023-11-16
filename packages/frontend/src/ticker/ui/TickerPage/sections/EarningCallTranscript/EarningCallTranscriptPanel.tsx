import React from "react";
import { Card, CardContent, Grid } from "@mui/material";
import { useTranscriptHighlightAndTakeaway } from "../../../hooks/useTranscriptHighlightAndTakeaway";

export interface Props {
  symbol: string;
}

const EarningCallTranscriptPanel: React.FunctionComponent<Props> = ({
  symbol,
}: Props) => {
  const { data, isLoading } = useTranscriptHighlightAndTakeaway(symbol);

  if (isLoading) {
    return <p>Please wait...</p>;
  }

  return data ? (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12}>
        <Card>
          <CardContent style={{ whiteSpace: "pre-wrap" }}>{data}</CardContent>
        </Card>
      </Grid>
    </Grid>
  ) : (
    <p>Transcript analysis available for {symbol}</p>
  );
};

export default EarningCallTranscriptPanel;
