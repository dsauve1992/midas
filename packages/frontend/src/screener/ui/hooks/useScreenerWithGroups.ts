import { useScreener } from "./useScreener.ts";
import { useMemo } from "react";
import { chain } from "lodash";
import { getMarketCapitalisationGroup } from "../../domain/MarketCapitalisationGroup.ts";

interface Props {
  hammerOnly: boolean;
}

export const useScreenerWithGroups = ({ hammerOnly }: Props) => {
  const { data: tickers, isLoading } = useScreener();

  const filteredTickers = useMemo(() => {
    if (!hammerOnly) {
      return tickers;
    }

    return tickers?.filter(({ open, close, high, low, ema10 }) => {
      const upperWick = high - Math.max(open, close);
      const lowerWick = Math.min(open, close) - low;

      return lowerWick > 2 * upperWick && low < ema10;
    });
  }, [hammerOnly, tickers]);

  const groupedBySector = useMemo(() => {
    return chain(filteredTickers).groupBy("sector").value();
  }, [filteredTickers]);

  const groupedByCapitalisation = useMemo(() => {
    return chain(filteredTickers)
      .map((el) => ({
        ...el,
        marketCapGroup: getMarketCapitalisationGroup(el.capitalisation),
      }))
      .groupBy("marketCapGroup")
      .value();
  }, [filteredTickers]);

  return {
    tickers: filteredTickers,
    isLoading,
    groupedByCapitalisation,
    groupedBySector,
  };
};
