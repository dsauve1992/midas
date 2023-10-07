import { Injectable } from '@nestjs/common';

@Injectable()
export class GetIncomeStatementUseCase {
  execute(symbol: string) {
    return `getIncomeStatement : ${symbol}`;
  }
}
