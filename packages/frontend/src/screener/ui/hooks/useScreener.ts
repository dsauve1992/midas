import { useQuery } from "react-query";
import { UseQueryResult } from "react-query/types/react/types";
import { useApiClientInstance } from "../../../api/useApiClient.ts";
import { ScreenerClient } from "../../../api/ScreenerClient.ts";
import { NewScreenerEntryFrontendDto } from "backend/src/shared-types/new-screener-entry-frontend.dto";

export const useScreener = (): UseQueryResult<
  NewScreenerEntryFrontendDto[]
> => {
  const instance = useApiClientInstance(ScreenerClient);

  return useQuery<NewScreenerEntryFrontendDto[]>([`screener`], () =>
    instance.query(),
  );
};
