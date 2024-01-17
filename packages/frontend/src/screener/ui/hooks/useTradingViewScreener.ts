import { useQuery } from "react-query";
import { UseQueryResult } from "react-query/types/react/types";
import { ScreenerClient } from "../../../api/ScreenerClient.ts";
import { chain } from "lodash";
import { useApiClientInstance } from "../../../api/useApiClient.ts";
import { ScreenerEntryEntity } from "backend/src/shared-types/screener-entry.entity";

export const useScreener = (): UseQueryResult<ScreenerEntryEntity[]> => {
  const instance = useApiClientInstance(ScreenerClient);

  return {
    ...useQuery<ScreenerEntryEntity[]>(
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
