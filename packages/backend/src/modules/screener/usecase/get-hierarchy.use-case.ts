import { Injectable } from '@nestjs/common';
import { ScreenerResponse } from '../../../shared-types/screener';
import { chain } from 'lodash';
import { ScreenerRepository } from '../repository/screener.repository';

@Injectable()
export class GetHierarchyUseCase {
  constructor(private readonly screenerRepository: ScreenerRepository) {}

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
              stocks: value,
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
