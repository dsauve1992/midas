import axios from 'axios'
import moment from 'moment'
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
} from './types'
import CloudFunctionApi from '../global/CloudFunctionApi'

class FinancialModelingPrepClient extends CloudFunctionApi {
   private static instance: FinancialModelingPrepClient | null = null

   private static readonly BASE_PATH = 'fmpProxy'

   private static readonly FMP_BASE_URL =
      'https://financialmodelingprep.com/api'

   static getInstance(): FinancialModelingPrepClient {
      if (this.instance === null) {
         this.instance = new FinancialModelingPrepClient()
      }

      return this.instance
   }

   protected static getBaseUrl(): string {
      return super.buildUrl(this.BASE_PATH)
   }

   async getAllSymbols(): Promise<StockSymbol[]> {
      return this.requestTo<StockSymbol[]>('/available-traded/list')
   }

   async getProfile(symbol: string): Promise<StockProfile> {
      return (await this.requestTo<StockProfile[]>(`/profile/${symbol}`))[0]
   }

   async getCashFlowStatements(symbol: string): Promise<CashFlowStatement[]> {
      return this.requestTo<CashFlowStatement[]>(
         `/cash-flow-statement/${symbol}`,
         { limit: 10 }
      )
   }

   async getCashFlowStatementsGrowth(
      symbol: string
   ): Promise<CashFlowStatementGrowth[]> {
      return this.requestTo<CashFlowStatementGrowth[]>(
         `/cash-flow-statement-growth/${symbol}`,
         { limit: 10 }
      )
   }

   async getDiscountedCashFlow(symbol: string): Promise<DiscountedCashFlow[]> {
      return this.requestTo<DiscountedCashFlow[]>(
         `/discounted-cash-flow/${symbol}`
      )
   }

   async getKeyMetrics(
      symbol: string,
      parameters?: { [key: string]: any }
   ): Promise<KeyMetrics> {
      return (
         await this.requestTo<KeyMetrics[]>(
            `/key-metrics-ttm/${symbol}`,
            parameters
         )
      )[0]
   }

   async getIncomeStatements(
      symbol: string,
      parameters?: { [key: string]: any }
   ): Promise<IncomeStatement[]> {
      return this.requestTo<IncomeStatement[]>(
         `/income-statement/${symbol}`,
         parameters
      )
   }

   async getEarningCallTranscript(
      symbol: string,
      parameters?: { [key: string]: any }
   ): Promise<EarningCallTranscript[]> {
      return this.requestTo<EarningCallTranscript[]>(
         `/earning_call_transcript/${symbol}`,
         parameters
      )
   }

   async getFinancialGrowth(symbol: string): Promise<FinancialGrowth[]> {
      return this.requestTo<FinancialGrowth[]>(`/financial-growth/${symbol}`, {
         limit: 10,
      })
   }

   async getEnterpriseValue(symbol: string): Promise<EnterpriseValue> {
      return (
         await this.requestTo<EnterpriseValue[]>(
            `/enterprise-values/${symbol}`,
            { limit: 1 }
         )
      )[0]
   }

   async getEnterpriseRatios(
      symbol: string,
      parameters?: { [key: string]: any }
   ): Promise<EnterpriseRatio[]> {
      return this.requestTo<EnterpriseRatio[]>(`/ratios/${symbol}`, parameters)
   }

   async getEnterpriseRatioTTM(symbol: string): Promise<EnterpriseRatioTTM> {
      return (
         await this.requestTo<EnterpriseRatioTTM[]>(`/ratios-ttm/${symbol}`, {
            limit: 10,
         })
      )[0]
   }

   async getScore(symbol: string): Promise<Score> {
      return (await this.requestTo<Score[]>('/score', { symbol }, 4))[0]
   }

   async stockScreen(filters: Partial<ScreenFilter>): Promise<ScreenSymbol[]> {
      return this.requestTo<ScreenSymbol[]>('/stock-screener', filters)
   }

   async getRating(symbol: string): Promise<Rating> {
      const [first = {} as Rating] = await this.requestTo<Rating[]>(
         `/rating/${symbol}`
      )
      return first
   }

   async getInsiderTrading(symbol: string): Promise<InsiderTradingEvent[]> {
      return this.requestTo<InsiderTradingEvent[]>(
         '/insider-trading',
         { symbol, limit: 100 },
         4
      )
   }

   async getEarningsSurprises(symbol: string): Promise<EarningsSurprise[]> {
      return this.requestTo<EarningsSurprise[]>(`/earnings-surprises/${symbol}`)
   }

   async getStockPeers(symbol: string): Promise<StockPeer> {
      return (
         await this.requestTo<StockPeer[]>('/stock_peers', { symbol }, 4)
      )[0]
   }

   async getSharesFloat(symbol: string): Promise<SharesFloat> {
      return (
         await this.requestTo<SharesFloat[]>('/shares_float', { symbol }, 4)
      )[0]
   }

   async getInstitutionalHolders(
      symbol: string
   ): Promise<InstitutionalHolder[]> {
      return this.requestTo<InstitutionalHolder[]>(
         `/institutional-holder/${symbol}`
      )
   }

   async getInstitutionalOwnership(
      symbol: string
   ): Promise<InstitutionalHolder[]> {
      return this.requestTo<InstitutionalHolder[]>(
         `/institutional-ownership/institutional-holders/symbol-ownership-percent`,
         { symbol, date: moment().format('YYYY-MM-DD') },
         4
      )
   }

   async getSocialSentiment(symbol: string): Promise<SocialSentiment[]> {
      return this.requestTo<SocialSentiment[]>(
         '/historical/social-sentiment',
         { symbol, limit: 10000 },
         4
      )
   }

   async getOverallInsiderTrading(
      page = 0,
      aquisitionType = 'P-Purchase'
   ): Promise<InsiderTradingEvent[]> {
      return this.requestTo<InsiderTradingEvent[]>(
         '/insider-trading',
         { page, aquisitionType },
         4
      )
   }

   async getRealTimeQuotesByMarket(market: Market): Promise<RealTimeQuote[]> {
      return this.requestTo<RealTimeQuote[]>(`/quotes/${market}`)
   }

   async search(query: string): Promise<SearchResult[]> {
      return this.requestTo<SearchResult[]>('/search', { limit: 10, query }, 3)
   }

   private async requestTo<T>(
      route: string,
      parameters: { [key: string]: any } = {},
      version = 3
   ): Promise<T> {
      const response = await axios.get<T>(
         this.buildUrl(route, parameters, version)
      )
      return response.data
   }

   private buildUrl(
      route: string,
      parameters: { [k: string]: string | number },
      version: number
   ) {
      const stringParameters = this.prepareParameters(parameters)

      const query = encodeURIComponent(
         `${FinancialModelingPrepClient.FMP_BASE_URL}/v${version}${route}${stringParameters}`
      )
      return `${FinancialModelingPrepClient.getBaseUrl()}?query=${query}`
   }

   private prepareParameters(parameters?: { [p: string]: string | number }) {
      if (parameters) {
         const queryString = Object.keys(parameters)
            .map((key) => `${key}=${parameters[key].toString()}`)
            .join('&')

         return `?${queryString}`
      }

      return ''
   }
}

export default FinancialModelingPrepClient
