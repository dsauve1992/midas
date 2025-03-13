import { PositionModel } from '../modules/position/read/model/PositionModel';

export type CreatePositionRequestDto = {
  symbol: string;
  entryPrice: number;
  stopLoss: number;
  nbShares: number;
  riskPercentage: number;
};

export type PositionModelDto = PositionModel;
