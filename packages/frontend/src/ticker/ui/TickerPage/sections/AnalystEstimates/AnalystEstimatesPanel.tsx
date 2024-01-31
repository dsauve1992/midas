import React from "react";
import { useAnalystEstimates } from "../../../hooks/useAnalystEstimates.ts";

export interface Props {
  symbol: string;
}

const AnalystEstimatesPanel: React.FunctionComponent<Props> = ({
  symbol,
}: Props) => {
  const { data, isLoading } = useAnalystEstimates(symbol);

  if (isLoading) {
    return <p>Please wait...</p>;
  }

  return data ? (
    <p>{JSON.stringify(data)}</p>
  ) : (
    <p>No Analyst Estimates data available for {symbol}</p>
  );
};

export default AnalystEstimatesPanel;
