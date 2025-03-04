import { useQuery } from "react-query";
import { useApiClientInstance } from "../../api/useApiClient.ts";
import { PositionClient } from "../client/PositionClient.ts";
import { PositionModelDto } from "backend/src/shared-types/position";

export const useGetPositions = () => {
  const instance = useApiClientInstance(PositionClient);

  return useQuery<PositionModelDto[]>(["positions"], () => instance.getAll(), {
    select: (data) =>
      data.sort((a, b) => a.createdAt.valueOf() - b.createdAt.valueOf()),
  });
};
