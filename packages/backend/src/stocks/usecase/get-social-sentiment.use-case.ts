import { Injectable } from '@nestjs/common';

@Injectable()
export class GetSocialSentimentUseCase {
  execute(symbol: string) {
    return `getSocialSentiment : ${symbol}`;
  }
}
