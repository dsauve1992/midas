import axios from 'axios'
import type {
   EarningCallTranscript,
   EnterpriseRatio,
   IncomeStatement,
   SearchResult,
} from '../../../../shared-types/financial-modeling-prep.d.ts'


class FinancialModelingPrepClient {
   private static instance: FinancialModelingPrepClient | null = null

   static getInstance(): FinancialModelingPrepClient {
      if (this.instance === null) {
         this.instance = new FinancialModelingPrepClient()
      }

      return this.instance
   }

   protected static getBaseUrl(): string {
      return `${import.meta.env.VITE_BACKEND_URL}/api/fmp`
   }

   async getIncomeStatements(
      symbol: string,
      parameters?: { [key: string]: string| number|boolean }
   ): Promise<IncomeStatement[]> {
      return this.requestTo<IncomeStatement[]>(
         `/income-statement/${symbol}`,
         parameters
      )
   }

   async getEarningCallTranscript(
      symbol: string,
      parameters?: { [key: string]: string| number|boolean }
   ): Promise<EarningCallTranscript[]> {
      return this.requestTo<EarningCallTranscript[]>(
         `/earning_call_transcript/${symbol}`,
         parameters
      )
   }

   async getEnterpriseRatios(
      symbol: string,
      parameters?: { [key: string]: string| number|boolean }
   ): Promise<EnterpriseRatio[]> {
      return this.requestTo<EnterpriseRatio[]>(`/ratios/${symbol}`, parameters)
   }

   async search(query: string): Promise<SearchResult[]> {
      return this.requestTo<SearchResult[]>('/search', { limit: 10, query }, 3)
   }

   private async requestTo<T>(
      route: string,
      parameters: { [key: string]: string | number| boolean } = {},
      version = 3
   ): Promise<T> {
      const response = await axios.get<T>(
         this.buildUrl(route, parameters, version)
      )
      return response.data
   }

   private buildUrl(
      route: string,
      parameters: { [k: string]: string | number| boolean },
      version: number
   ) {
      const stringParameters = this.prepareParameters(parameters)

      return `${FinancialModelingPrepClient.getBaseUrl()}/v${version}${route}${stringParameters}`
   }

   private prepareParameters(parameters?: { [p: string]: string | number| boolean }) {
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
