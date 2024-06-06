import React from "react";
import { usePriceTarget } from "../../../hooks/usePriceTarget.ts";

export interface Props {
  symbol: string;
}

const PriceTargetPanel: React.FunctionComponent<Props> = ({
  symbol,
}: Props) => {
  const { data, isLoading } = usePriceTarget(symbol);

  if (isLoading) {
    return <p>Please wait ...</p>;
  }

  return data?.length ? (
    <ul>
      {data.map((record) => (
        <li key={record.publishedDate}>
          <p>Published Date: {record.publishedDate}</p>
          <p>adjPriceTarget: {record.adjPriceTarget}</p>
          <p>analystCompany: {record.analystCompany}</p>
          <p>analystName: {record.analystName}</p>
          <p>newsTitle: {record.newsTitle}</p>
          <p>url: {record.newsURL}</p>
        </li>
      ))}
    </ul>
  ) : (
    <p>There is no price target for {symbol}</p>
  );
};

export default PriceTargetPanel;
