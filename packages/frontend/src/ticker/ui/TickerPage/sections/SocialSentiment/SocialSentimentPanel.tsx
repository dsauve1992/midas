import React from "react";
import { Card, CardContent } from "@mui/material";
import { useSocialSentiment } from "../../../hooks/useSocialSentiment";
import { SocialSentimentChart } from "./SocialSentimentChart";
import { LoadingPlaceHolder } from "../../../../../lib/ui/utils/LoadingPlaceHolder";

export interface Props {
  symbol: string;
}

const SocialSentimentPanel: React.FunctionComponent<Props> = ({
  symbol,
}: Props) => {
  const { data, isLoading } = useSocialSentiment(symbol);

  return (
    <LoadingPlaceHolder
      isLoading={isLoading}
      data={data}
      noDataMessage={`There is no social sentiment data for ${symbol}`}
    >
      {(dataReady) => (
        <Card style={{ height: "625px" }}>
          <CardContent style={{ height: "100%" }}>
            <SocialSentimentChart data={dataReady} />
          </CardContent>
        </Card>
      )}
    </LoadingPlaceHolder>
  );
};

export default SocialSentimentPanel;
