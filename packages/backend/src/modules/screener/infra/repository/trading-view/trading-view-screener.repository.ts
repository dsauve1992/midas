import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as screenerParameters_v2 from './screenerParameter.json';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { ScreenerRepository } from '../../../domain/repository/screener.repository';
import { ScreenerSnapshot } from '../../../domain/model/screener-snapshot';

@Injectable()
export class TradingViewScreenerRepository implements ScreenerRepository {
  constructor(private httpService: HttpService) {}

  async search(): Promise<ScreenerSnapshot> {
    const response = await firstValueFrom(
      this.httpService.post(
        'https://scanner.tradingview.com/global/scan',
        screenerParameters_v2,
      ),
    );

    const symbols = response.data.data.map((entry: any) => {
      const [exchange, symbol] = entry.s.split(':');

      return new SymbolWithExchange(exchange, symbol);
    });

    return new ScreenerSnapshot(symbols);
  }
}
