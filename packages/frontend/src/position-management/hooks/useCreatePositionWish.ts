import { useMutation, useQueryClient } from "react-query";
import { useApiClientInstance } from "../../api/useApiClient.ts";
import { PositionClient } from "../client/PositionClient.ts";
import { CreatePositionRequestDto } from "backend/src/shared-types/position";

export type useCreatePositionWishProps = {
  onSuccess?: () => void;
  onError?: () => void;
};

export const useCreatePositionWish = ({
  onSuccess,
  onError,
}: useCreatePositionWishProps) => {
  const client = useQueryClient();
  const instance = useApiClientInstance(PositionClient);

  const { mutate, isLoading } = useMutation(
    ({ request }: { request: CreatePositionRequestDto }) =>
      instance.createPositionWish(request),
    {
      onSuccess: async () => {
        await client.invalidateQueries(["positions"]);
        onSuccess?.();
      },
      onError,
    },
  );

  return {
    create: mutate,
    processing: isLoading,
  };
};
