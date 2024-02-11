import { useEarningSurprises } from "../../../../hooks/useEarningSurprises.ts";
import { EarningSurprisesChart } from "./EarningSurprisesChart.tsx";

type Props = {
  symbol: string;
};

export const StandaloneEarningSurprisesChart = ({ symbol }: Props) => {
  const { data, isLoading } = useEarningSurprises(symbol);

  if (isLoading) {
    return <p>Please wait...</p>;
  }

  return data ? (
    <EarningSurprisesChart data={data} />
  ) : (
    <p>No Earning surprises data available for {symbol}</p>
  );
};
