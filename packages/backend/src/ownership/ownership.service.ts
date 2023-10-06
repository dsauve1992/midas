import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OwnershipService {
  constructor(private httpService: HttpService) {}

  async getHistory(symbol: string) {
    const matchingResult = await this.findTicker(symbol as string);

    const { data } = await firstValueFrom(
      await this.httpService.get(
        // eslint-disable-next-line max-len
        `https://services.bingapis.com/contentservices-finance.hedgefunddataprovider/api/v1/GetSecurityAggregateHoldings/${matchingResult.SecId}`,
      ),
    );

    return data;
  }

  async getTopShareHolders(symbol: string) {
    const matchingResult = await this.findTicker(symbol as string);

    const { data } = await firstValueFrom(
      await this.httpService.get(
        // eslint-disable-next-line max-len
        `https://services.bingapis.com/contentservices-finance.hedgefunddataprovider/api/v1/GetSecurityTopShareHolders/${matchingResult.SecId}?rangeStart=1&count=50`,
      ),
    );

    return data;
  }

  private async findTicker(symbol: string) {
    const { data: searchResults } = await firstValueFrom(
      await this.httpService.get(
        // eslint-disable-next-line max-len
        `https://services.bingapis.com/contentservices-finance.csautosuggest/api/v1/Query?query=${symbol}&market=en-us`,
      ),
    );

    return searchResults.data.stocks
      .map((s: string) => JSON.parse(s))
      .find((el: any) => el.RT00S === symbol);
  }
}
