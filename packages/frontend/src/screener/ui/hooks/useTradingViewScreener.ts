import { useQuery } from "react-query";
import { UseQueryResult } from "react-query/types/react/types";
import { ScreenerClient, ScreenerEntry } from "../../../api/ScreenerClient.ts";
import { orderBy } from "lodash";
import { useApiClientInstance } from "../../../api/useApiClient.ts";

export const useScreener = (): UseQueryResult<ScreenerEntry[]> => {
  const instance = useApiClientInstance(ScreenerClient);

  return {
    ...useQuery<ScreenerEntry[]>(
      [`screener`],
      () => instance.queryWithRatings(),
      {
        select: (data) =>
          orderBy(
            data,
            ({ technicalRating, fundamentalRating }) =>
              technicalRating * fundamentalRating,
            "desc",
          ),
      },
    ),
  };
};
