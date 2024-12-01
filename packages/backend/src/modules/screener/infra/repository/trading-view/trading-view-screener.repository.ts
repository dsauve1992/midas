import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as screenerParameters_v2 from './screenerParameter.json';
import { SymbolWithExchange } from '../../../../stocks/domain/symbol-with-exchange';
import { ScreenerRepository } from '../../../domain/repository/screener.repository';
import {
  ScreenerEntry,
  ScreenerSnapshot,
} from '../../../domain/model/screener-snapshot';

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

    const entries: ScreenerEntry[] = response.data.data.map((entry: any) => {
      const [exchange, symbol] = entry.s.split(':');

      const [
        ,
        ,
        ,
        sector,
        industry,
        ,
        market_cap_basic,
        open,
        high,
        low,
        close,
        volume,
        ema10,
        ema20,
        sma30,
      ] = entry.d;

      return new ScreenerEntry(
        new SymbolWithExchange(exchange, symbol),
        sector,
        industry,
        market_cap_basic,
        open,
        high,
        low,
        close,
        volume,
        ema10,
        ema20,
        sma30,
      );
    });

    return new ScreenerSnapshot(entries);
  }
}
