import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { format } from 'date-fns';
import {
  CashFlowStatement,
  CashFlowStatementGrowth,
  DiscountedCashFlow,
  EarningCallTranscript,
  EarningsSurprise,
  EnterpriseRatio,
  EnterpriseRatioTTM,
  EnterpriseValue,
  FinancialGrowth,
  IncomeStatement,
  InsiderTradingEvent,
  InstitutionalHolder,
  KeyMetrics,
  Market,
  Rating,
  RealTimeQuote,
  Score,
  ScreenFilter,
  ScreenSymbol,
  SearchResult,
  SharesFloat,
  SocialSentiment,
  StockPeer,
  StockProfile,
  StockSymbol,
} from 'frontend/src/api/financialModelingPrep/types';

@Injectable()
export class FinancialModelingPrepFetcherClient {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async getAllSymbols(): Promise<StockSymbol[]> {
    return this.fetch<StockSymbol[]>('/v3/available-traded/list');
  }

  async getProfile(symbol: string): Promise<StockProfile> {
    return (await this.fetch<StockProfile[]>(`/v3/profile/${symbol}`))[0];
  }

  async getCashFlowStatements(symbol: string): Promise<CashFlowStatement[]> {
    return this.fetch<CashFlowStatement[]>(
      `/v3/cash-flow-statement/${symbol}`,
      {
        limit: 10,
      },
    );
  }

  async getCashFlowStatementsGrowth(
    symbol: string,
  ): Promise<CashFlowStatementGrowth[]> {
    return this.fetch<CashFlowStatementGrowth[]>(
      `/v3/cash-flow-statement-growth/${symbol}`,
      { limit: 10 },
    );
  }

  async getDiscountedCashFlow(symbol: string): Promise<DiscountedCashFlow[]> {
    return this.fetch<DiscountedCashFlow[]>(
      `/v3/discounted-cash-flow/${symbol}`,
    );
  }

  async getKeyMetrics(
    symbol: string,
    parameters?: { [key: string]: never },
  ): Promise<KeyMetrics> {
    return (
      await this.fetch<KeyMetrics[]>(
        `/v3/key-metrics-ttm/${symbol}`,
        parameters,
      )
    )[0];
  }

  async getIncomeStatements(
    symbol: string,
    parameters?: { [key: string]: string | number | boolean },
  ): Promise<IncomeStatement[]> {
    return this.fetch<IncomeStatement[]>(
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

  async getFinancialGrowth(symbol: string): Promise<FinancialGrowth[]> {
    return this.fetch<FinancialGrowth[]>(`/v3/financial-growth/${symbol}`, {
      limit: 10,
    });
  }

  async getEnterpriseValue(symbol: string): Promise<EnterpriseValue> {
    return (
      await this.fetch<EnterpriseValue[]>(`/v3/enterprise-values/${symbol}`, {
        limit: 1,
      })
    )[0];
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
        limit: 10,
      })
    )[0];
  }

  async getScore(symbol: string): Promise<Score> {
    return (await this.fetch<Score[]>('/v4/score', { symbol }))[0];
  }

  async stockScreen(filters: Partial<ScreenFilter>): Promise<ScreenSymbol[]> {
    return this.fetch<ScreenSymbol[]>('/v3/stock-screener', filters);
  }

  async getRating(symbol: string): Promise<Rating> {
    const [first = {} as Rating] = await this.fetch<Rating[]>(
      `/v3/rating/${symbol}`,
    );
    return first;
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

  async getStockPeers(symbol: string): Promise<StockPeer> {
    return (await this.fetch<StockPeer[]>('/v4/stock_peers', { symbol }))[0];
  }

  async getSharesFloat(symbol: string): Promise<SharesFloat> {
    return (await this.fetch<SharesFloat[]>('/v4/shares_float', { symbol }))[0];
  }

  async getInstitutionalHolders(
    symbol: string,
  ): Promise<InstitutionalHolder[]> {
    return this.fetch<InstitutionalHolder[]>(
      `/v3/institutional-holder/${symbol}`,
    );
  }

  async getInstitutionalOwnership(
    symbol: string,
  ): Promise<InstitutionalHolder[]> {
    return this.fetch<InstitutionalHolder[]>(
      `/v4/institutional-ownership/institutional-holders/symbol-ownership-percent`,
      { symbol, date: format(new Date(), 'YYYY-MM-DD') },
    );
  }

  async getSocialSentiment(symbol: string): Promise<SocialSentiment[]> {
    return this.fetch<SocialSentiment[]>('/v4/historical/social-sentiment', {
      symbol,
      limit: 10000,
    });
  }

  async getOverallInsiderTrading(
    page = 0,
    aquisitionType = 'P-Purchase',
  ): Promise<InsiderTradingEvent[]> {
    return this.fetch<InsiderTradingEvent[]>('/v4/insider-trading', {
      page,
      aquisitionType,
    });
  }

  async getRealTimeQuotesByMarket(market: Market): Promise<RealTimeQuote[]> {
    return this.fetch<RealTimeQuote[]>(`/v3/quotes/${market}`);
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
      await this.httpService.get(url, { params: queryParams }),
    );

    return data;
  }
}
