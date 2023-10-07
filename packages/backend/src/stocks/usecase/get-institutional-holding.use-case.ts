import { Injectable } from '@nestjs/common';

@Injectable()
export class GetInstitutionalHoldingUseCase {
  execute(symbol: string) {
    return `getInstitutionalHolding : ${symbol}`;
  }
}
