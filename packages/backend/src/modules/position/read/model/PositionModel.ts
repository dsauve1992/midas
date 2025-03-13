import { SymbolWithExchange } from '../../../stocks/domain/symbol-with-exchange';

export interface PositionModel {
  id: string;
  userId: string;
  symbol: SymbolWithExchange;
  quantity: number;
  entryPrice: number;
  stopLoss: number;
  riskPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}
