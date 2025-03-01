export type CreatePositionRequestDto = {
  symbol: string;
  portfolioValue: number;
  buyPrice: number;
  stopLoss: number;
  riskPercentage: number;
};
