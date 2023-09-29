import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class FinancialModelingPrepFetcherService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async fetch(params: string, query: { [key: string]: string }) {
    const apiKey = this.configService.get<string>('FMP_API_KEY');
    const url = `https://financialmodelingprep.com/api/${params}`;

    const queryParams = query;
    queryParams['apikey'] = apiKey;

    const { data } = await firstValueFrom(
      await this.httpService.get(url, { params: queryParams }),
    );
    return data;
  }
}
