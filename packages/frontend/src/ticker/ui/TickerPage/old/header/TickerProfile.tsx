import TickerTitle from "./TickerTitle.tsx";
import TickerFamily from "./TickerFamily.tsx";
import { StockGeneralInformationResponseDto } from "backend/src/shared-types/response.dto";

type TickerProfileProps = {
  profile: StockGeneralInformationResponseDto;
};

export function TickerProfile({ profile }: TickerProfileProps) {
  return (
    <>
      <TickerTitle profile={profile} />
      <TickerFamily profile={profile} />
    </>
  );
}
