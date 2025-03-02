export type CreatePositionRequestDto = {
  symbol: string;
  buyPrice: number;
  stopLoss: number;
  nbShares: number;
  riskPercentage: number;
};
