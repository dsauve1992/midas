import {groupBy} from "lodash";
import {Holder, ShareholderHistory,} from "backend/src/shared-types/institutional-ownership";

export const useOwnershipHistoryByInstitution = (
  data: ShareholderHistory[],
): {
  holder: Holder;
  history: Omit<
    ShareholderHistory,
    | "holder"
    | "securityId"
    | "securityName"
    | "ticker"
    | "sector"
    | "issuerThumbnailUrl"
  >[];
}[] => {
  const byInstitution = groupBy(data, "holder.holderId");

  return Object.values(byInstitution).map((historyByInstitution) => ({
    holder: historyByInstitution[0].holder,
    history: historyByInstitution.map(
      ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        holder,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        securityId,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        securityName,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ticker,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        sector,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        issuerThumbnailUrl,
        ...rest
      }) => ({ ...rest }),
    ),
  }));
};
