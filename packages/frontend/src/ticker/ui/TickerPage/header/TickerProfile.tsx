import TickerTitle from "./TickerTitle";
import TickerFamily from "./TickerFamily";
import { useCompanyGeneralInformation } from "../../hooks/useCompanyGeneralInformation.ts";

type TickerProfileProps = {
  symbol: string;
};

export function TickerProfile({ symbol }: TickerProfileProps) {
  const { isLoading: profileLoading, data: profile } =
    useCompanyGeneralInformation(symbol);

  if (profileLoading) {
    return <p>Please wait...</p>;
  }

  return profile ? (
    <>
      <TickerTitle profile={profile} />
      <TickerFamily profile={profile} />
    </>
  ) : null;
}
