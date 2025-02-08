import { useMutation, useQueryClient } from "react-query";
import { PositionWishFormData } from "../domain/PositionWishFormData.ts";
import { useApiClientInstance } from "../../api/useApiClient.ts";
import { PositionClient } from "../client/PositionClient.ts";

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
    ({ formData }: { formData: PositionWishFormData }) =>
      instance.createPositionWish(formData),
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
