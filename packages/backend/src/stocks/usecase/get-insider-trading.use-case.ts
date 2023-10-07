import { Injectable } from '@nestjs/common';

@Injectable()
export class GetInsiderTradingUseCase {
  execute(symbol: string) {
    return `getInsiderTrading : ${symbol}`;
  }
}
