import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  EarningCallTranscript,
  EarningsSurprise,
  EnterpriseRatio,
  EnterpriseRatioTTM,
  IncomeStatementDto,
  InsiderTradingEvent,
  SearchResult,
  SharesFloat,
  SocialSentiment,
  StockProfile,
} from '../shared-types/financial-modeling-prep';

@Injectable()
export class FinancialModelingPrepService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getProfile(symbol: string): Promise<StockProfile> {
    return (await this.fetch<StockProfile[]>(`/v3/profile/${symbol}`))[0];
  }

  async getIncomeStatements(
    symbol: string,
    parameters?: { [key: string]: string | number | boolean },
  ): Promise<IncomeStatementDto[]> {
    return this.fetch<IncomeStatementDto[]>(
      `/v3/income-statement/${symbol}`,
      parameters,
    );
  }

  async getEarningCallTranscript(
    symbol: string,
    parameters?: { [key: string]: string | number | boolean },
  ): Promise<EarningCallTranscript[]> {
    return this.fetch<EarningCallTranscript[]>(
      `/v3/earning_call_transcript/${symbol}`,
      parameters,
    );
  }

  async getEnterpriseRatios(
    symbol: string,
    parameters?: { [key: string]: string | number | boolean },
  ): Promise<EnterpriseRatio[]> {
    return this.fetch<EnterpriseRatio[]>(`/v3/ratios/${symbol}`, parameters);
  }

  async getEnterpriseRatioTTM(symbol: string): Promise<EnterpriseRatioTTM> {
    return (
      await this.fetch<EnterpriseRatioTTM[]>(`/v3/ratios-ttm/${symbol}`, {
        limit: 1,
      })
    )[0];
  }

  async getInsiderTrading(symbol: string): Promise<InsiderTradingEvent[]> {
    return this.fetch<InsiderTradingEvent[]>('/v4/insider-trading', {
      symbol,
      limit: 100,
    });
  }

  async getEarningsSurprises(symbol: string): Promise<EarningsSurprise[]> {
    return this.fetch<EarningsSurprise[]>(`/v3/earnings-surprises/${symbol}`);
  }

  async getSharesFloat(symbol: string): Promise<SharesFloat> {
    return (await this.fetch<SharesFloat[]>('/v4/shares_float', { symbol }))[0];
  }

  async getSocialSentiment(symbol: string): Promise<SocialSentiment[]> {
    return this.fetch<SocialSentiment[]>('/v4/historical/social-sentiment', {
      symbol,
      limit: 10000,
    });
  }
  async search(query: string): Promise<SearchResult[]> {
    return this.fetch<SearchResult[]>('/v3/search', { limit: 10, query });
  }

  async fetch<T>(
    params: string,
    query: { [key: string]: string | number | boolean } = {},
  ): Promise<T> {
    const apiKey = this.configService.get<string>('FMP_API_KEY');
    const url = `https://financialmodelingprep.com/api/${params}`;

    const queryParams = query;
    queryParams['apikey'] = apiKey;

    const { data } = await firstValueFrom(
      this.httpService.get(url, { params: queryParams }),
    );

    return data;
  }
}
