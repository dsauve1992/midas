import { InstitutionalOwnershipHistoryByQuarter } from "./InstitutionalOwnershipHistoryByQuarter.tsx";
import { useInstitutionalOwnership } from "../../../hooks/useInstitutionalOwnership.ts";

interface Props {
  symbol: string;
}
export const StandaloneInstitutionalOwnershipHistoryByQuarter = ({
  symbol,
}: Props) => {
  const { data, isLoading } = useInstitutionalOwnership(symbol);

  if (isLoading) {
    return <p>Please wait ...</p>;
  }

  return data?.history?.length ? (
    <InstitutionalOwnershipHistoryByQuarter history={data?.history} />
  ) : (
    <p>No data available</p>
  );
};
