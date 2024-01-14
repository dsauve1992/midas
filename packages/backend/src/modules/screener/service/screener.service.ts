import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as screenerParameters from './screenerParameter.json';
import { ScreenerRepository } from '../repository/screener.repository';

export type TradingViewScreenerEntry = {
  symbol: string;
  exchange: string;
  price: number;
  ema10: number;
  ema20: number;
  sma50: number;
  sma200: number;
  sector: string;
  industry: string;
};

@Injectable()
export class ScreenerService {
  constructor(
    private httpService: HttpService,
    private screenerRepository: ScreenerRepository,
  ) {}

  async search(): Promise<TradingViewScreenerEntry[]> {
    const response = await firstValueFrom(
      this.httpService.post(
        'https://scanner.tradingview.com/global/scan',
        screenerParameters,
      ),
    );

    return response.data.data.map((entry: any) => {
      const [exchange, symbol] = entry.s.split(':');
      const [price, ema10, ema20, sma50, sma200, sector, industry] = entry.d;

      return {
        symbol,
        exchange,
        price,
        ema10,
        ema20,
        sma50,
        sma200,
        sector,
        industry,
      };
    });
  }

  async searchWithRating() {
    return this.screenerRepository.getAll();
  }
}
