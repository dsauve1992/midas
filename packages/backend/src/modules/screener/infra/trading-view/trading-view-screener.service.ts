import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as screenerParameters_v2 from './screenerParameter.json';

export class SymbolWithExchange {
  constructor(
    readonly exchange: string,
    readonly symbol: string,
  ) {}
}

@Injectable()
export class TradingViewScreenerService {
  constructor(private httpService: HttpService) {}

  async search(): Promise<SymbolWithExchange[]> {
    const response = await firstValueFrom(
      this.httpService.post(
        'https://scanner.tradingview.com/global/scan',
        screenerParameters_v2,
      ),
    );

    return response.data.data.map((entry: any) => {
      const [exchange, symbol] = entry.s.split(':');

      return new SymbolWithExchange(exchange, symbol);
    });
  }
}
