import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';

export interface PositionModel {
  id: string;
  userId: string;
  symbol: SymbolWithExchange;
  quantity: number;
  buyPrice: number;
  stopLoss: number;
  riskPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}
