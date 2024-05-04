import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as screenerParameters_v2 from './screenerParameter.json';

export type TradingViewScreenerEntry = {
  symbol: string;
  exchange: string;
  sector: string;
  industry: string;
};

@Injectable()
export class TradingViewScreenerService {
  constructor(private httpService: HttpService) {}

  async search(): Promise<TradingViewScreenerEntry[]> {
    const response = await firstValueFrom(
      this.httpService.post(
        'https://scanner.tradingview.com/global/scan',
        screenerParameters_v2,
      ),
    );

    return response.data.data.map((entry: any) => {
      const [exchange, symbol] = entry.s.split(':');
      const [sector, industry] = entry.d;

      return {
        symbol,
        exchange,
        sector,
        industry,
      };
    });
  }
}
