import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as screenerParameters_v2 from './screenerParameter.json';
import { ScreenerRepository } from '../repository/screener.repository';
import { chain } from 'lodash';
import { ScreenerResponse } from '../../../shared-types/screener';

export type TradingViewScreenerEntry = {
  symbol: string;
  exchange: string;
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
      case 'Technology':
        return 'XLK';
      case 'Communication Services':
        return 'XLC';
      case 'Financial Services':
        return 'XLF';
      case 'Healthcare':
        return 'XLV';
      case 'Industrials':
        return 'XLI';
      case 'Consumer Discretionary':
        return 'XLY';
      case 'Consumer Staples':
        return 'XLP';
      case 'Real Estate':
        return 'XLRE';
      case 'Utilities':
        return 'XLU';
      case 'Energy':
        return 'XLE';
      default:
        return null;
    }
  }
}
