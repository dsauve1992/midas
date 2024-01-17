import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as screenerParameters from './screenerParameter.json';
import { ScreenerRepository } from '../repository/screener.repository';
import { chain } from 'lodash';
import { ScreenerResponse } from '../../../shared-types/screener';

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

  async getHierarchy(): Promise<ScreenerResponse> {
    const entries = await this.screenerRepository.getAll();

    return {
      sectors: chain(entries || [])
        .groupBy('sector')
        .map((value, key) => ({
          name: key,
          index: this.mapSectorNameToRelatedIndex(key),
          industryGroups: chain(value)
            .groupBy('industry')
            .map((value, key) => ({
              name: key,
              stocks: value,
            }))
            .value(),
        }))
        .value(),
    };
  }

  mapSectorNameToRelatedIndex(sectorName: string): string | null {
    switch (sectorName) {
      case 'Energy':
        return 'XLE';
      case 'Technology':
        return 'XLK';
      case 'Industrials':
        return 'XLI';
      case 'Financial Services':
        return 'XLF';
      case 'Communication Services':
        return 'XLC';
      case 'Healthcare':
        return 'XLV';
      case 'Real Estate':
        return 'XLRE';
      case 'Utilities':
        return 'XLU';
      case 'Financial':
        return 'XLF';
      default:
        return null;
    }
  }
}
