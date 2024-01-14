import { useQuery } from "react-query";
import { UseQueryResult } from "react-query/types/react/types";
import { ScreenerClient, ScreenerEntry } from "../../../api/ScreenerClient.ts";
import { chain } from "lodash";
import { useApiClientInstance } from "../../../api/useApiClient.ts";

export const useScreener = (): UseQueryResult<ScreenerEntry[]> => {
  const instance = useApiClientInstance(ScreenerClient);

  return {
    ...useQuery<ScreenerEntry[]>(
      [`screener`],
      () => instance.queryWithRatings(),
      {
        select: (data) =>
          chain(data)
            .filter((entry) => {
              return (
                entry.fundamentalRating >= 50 && entry.averageDailyRange >= 2
              );
            })
            .orderBy(
              ({ averageDailyRange, fundamentalRating }) =>
                averageDailyRange * fundamentalRating,
              "desc",
            )
            .value(),
      },
    ),
  };
};
