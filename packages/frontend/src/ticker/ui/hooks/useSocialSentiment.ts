import { useQuery } from "react-query";
import type { SocialSentiment } from "backend/src/shared-types/financial-modeling-prep";
import { StockClient } from "../../../api/StockClient.ts";
import { useApiClientInstance } from "../../../api/useApiClient.ts";

export const useSocialSentiment = (symbol: string) => {
  const instance = useApiClientInstance(StockClient);

  return useQuery<SocialSentiment[]>(["social-sentiment", symbol], () =>
    instance.getSocialSentiment(symbol),
  );
};
