import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  AggregateHolding,
  OwnershipHistoryResponse,
  ShareholderHistory,
  TopShareholdersResponse,
} from '../shared-types/institutional-ownership';

@Injectable()
export class OwnershipService {
  private static readonly EDGE_FUND_DATA_PROVIDER_BASE_URL = `https://services.bingapis.com/contentservices-finance.hedgefunddataprovider/api/v1`;
  private static readonly SEARCH_BASE_URL = `https://services.bingapis.com/contentservices-finance.csautosuggest/api/v1/Query`;
  constructor(private httpService: HttpService) {}

  async getHistory(symbol: string): Promise<AggregateHolding[]> {
    const matchingResult = await this.findTicker(symbol as string);

    const { data } = await firstValueFrom(
      this.httpService.get<OwnershipHistoryResponse>(
        // eslint-disable-next-line max-len
        `${OwnershipService.EDGE_FUND_DATA_PROVIDER_BASE_URL}/GetSecurityAggregateHoldings/${matchingResult.SecId}`,
      ),
    );

    return data.aggregateHoldings;
  }

  async getTopShareHolders(symbol: string): Promise<ShareholderHistory[]> {
    const matchingResult = await this.findTicker(symbol as string);

    const { data } = await firstValueFrom(
      this.httpService.get<TopShareholdersResponse>(
        // eslint-disable-next-line max-len
        `${OwnershipService.EDGE_FUND_DATA_PROVIDER_BASE_URL}/GetSecurityTopShareHolders/${matchingResult.SecId}?rangeStart=1&count=50`,
      ),
    );

    return data.securityOwnerships;
  }

  private async findTicker(symbol: string) {
    const { data: searchResults } = await firstValueFrom(
      this.httpService.get(
        // eslint-disable-next-line max-len
        `${OwnershipService.SEARCH_BASE_URL}?query=${symbol}&market=en-us`,
      ),
    );

    return searchResults.data.stocks
      .map((s: string) => JSON.parse(s))
      .find((el: any) => el.RT00S === symbol);
  }
}
