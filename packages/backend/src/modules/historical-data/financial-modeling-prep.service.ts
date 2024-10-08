import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import {
  AnalystEstimateEntry,
  EarningCalendarEntry,
  EarningsSurprise,
  EnterpriseRatio,
  EnterpriseRatioTTM,
  IncomeStatementDto,
  InsiderTradingEvent,
  OHLCVRecord,
  PriceTargetRecord,
  RealTimePrice,
  SearchTickerResult,
  SharesFloat,
  SocialSentiment,
  StockMarketInformation,
  StockProfile,
  TechnicalRecord,
  TimeFrame,
} from '../../shared-types/financial-modeling-prep';
import { format } from 'date-fns';

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

  async getPriceTarget(symbol: string): Promise<PriceTargetRecord[]> {
    return this.fetch<PriceTargetRecord[]>(`/v4/price-target`, { symbol });
  }

  async getDailyTechnicalIndicator(
    symbol: string,
    parameters?: { [key: string]: string | number | boolean },
  ): Promise<TechnicalRecord[]> {
    return this.fetch<TechnicalRecord[]>(
      `v3/technical_indicator/1day/${symbol}`,
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

  async getMarketOpeningInformation(): Promise<StockMarketInformation> {
    return this.fetch<StockMarketInformation>('v3/is-the-market-open');
  }

  async getHistoricalChart(
    symbol: string,
    timeframe: TimeFrame,
    period?: {
      from?: Date;
      to?: Date;
    },
  ): Promise<OHLCVRecord[]> {
    return this.fetch<OHLCVRecord[]>(
      `/v3/historical-chart/${timeframe}/${symbol}`,
      {
        from: period.from && format(period.from, 'yyyy-MM-dd'),
        to: period.to && format(period.to, 'yyyy-MM-dd'),
      },
    );
  }

  async getEarningCalendar(symbol: string) {
    return this.fetch<EarningCalendarEntry[]>(
      `/v3/historical/earning_calendar/${symbol}`,
    );
  }

  async getRealtimePrice(symbol: string): Promise<RealTimePrice> {
    return (
      await this.fetch<RealTimePrice[]>(
        `/v3/stock/full/real-time-price/${symbol}`,
      )
    )[0];
  }

  async getAnalystEstimates(
    symbol: string,
    parameters?: { [key: string]: string | number | boolean },
  ) {
    return this.fetch<AnalystEstimateEntry[]>(
      `/v3/analyst-estimates/${symbol}`,
      parameters,
    );
  }

  async searchTicker(query: string): Promise<SearchTickerResult[]> {
    return this.fetch<SearchTickerResult[]>('/v3/search-ticker', {
      limit: 10,
      query,
    });
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
