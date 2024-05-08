import { Injectable } from '@nestjs/common';
import { ScreenerResponse } from '../../../shared-types/screener';
import { chain } from 'lodash';
import { ScreenerRepository } from '../domain/screener.repository';

@Injectable()
export class GetHierarchyUseCase {
  constructor(private readonly screenerRepository: ScreenerRepository) {}

  // TODO this is a reading usecase. Do we need a usecase for reading?
  async execute(): Promise<ScreenerResponse> {
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
              stocks: value.map((entry) => ({
                symbol: entry.symbol,
                exchange: entry.exchange,
                sector: entry.sector,
                industry: entry.industry,
                fundamentalRating: entry.fundamentalRating,
                numberOfDaysUntilNextEarningCall:
                  entry.numberOfDaysUntilNextEarningCall,
                averageDailyRange: entry.averageDailyRange,
              })),
            }))
            .value(),
        }))
        .value(),
    };
  }

  mapSectorNameToRelatedIndex(sectorName: string): string | null {
    switch (sectorName) {
      case 'Basic Materials':
        return 'XLB';
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
      case 'Consumer Cyclical':
        return 'XLY';
      case 'Consumer Defensive':
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
