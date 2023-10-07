import { Injectable } from '@nestjs/common';

@Injectable()
export class GetEarningsSurprisesUseCase {
  execute(symbol: string) {
    return `getEarningsSurprises : ${symbol}`;
  }
}
