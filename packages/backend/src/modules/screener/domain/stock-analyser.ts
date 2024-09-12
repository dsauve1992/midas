import { Injectable } from '@nestjs/common';
import { SymbolWithExchange } from '../../stocks/domain/symbol-with-exchange';

@Injectable()
export class StockAnalyser {
  analyseSymbol(symbol: SymbolWithExchange) {
    throw new Error('Method not implemented.');
  }
}
