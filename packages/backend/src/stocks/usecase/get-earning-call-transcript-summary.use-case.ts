import { Injectable } from '@nestjs/common';

@Injectable()
export class GetEarningCallTranscriptSummaryUseCase {
  execute(symbol: string) {
    return `getEdf : ${symbol}`;
  }
}
