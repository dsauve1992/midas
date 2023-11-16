import {
  Holder,
  ShareholderHistory,
} from "backend/src/shared-types/institutional-ownership";

export type OwnershipPercentage = {
  holder: Holder;
  outstandingPercent: number;
};

export const useOwnershipPercentages = (
  data: ShareholderHistory[],
): [OwnershipPercentage[], number] => {
  const lastHoldingPeriod = data[0].holdingPeriod;

  const lastHoldingPeriodShareholderData = data.filter(({ holdingPeriod }) => {
    return (
      holdingPeriod.year === lastHoldingPeriod.year &&
      holdingPeriod.quarterOfYear === lastHoldingPeriod.quarterOfYear
    );
  });

  const ownershipByHolder = lastHoldingPeriodShareholderData.map(
    ({ holder, outstandingPercent }) => ({ holder, outstandingPercent }),
  );

  const total = ownershipByHolder
    .map(({ outstandingPercent }) => outstandingPercent)
    .reduce((acc, curr) => acc + curr, 0);

  return [ownershipByHolder, total];
};
