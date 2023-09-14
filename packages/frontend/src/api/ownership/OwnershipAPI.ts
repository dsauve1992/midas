import axios from 'axios'
import CloudFunctionApi from '../global/CloudFunctionApi'
import {
   OwnershipHistoryResponse,
   AggregateHolding,
   ShareholderHistory,
   TopShareholdersResponse,
} from './type'

class OwnershipAPI extends CloudFunctionApi {
   private static readonly BASE_PATH = 'ownership'

   static async getHistory(symbol: string): Promise<AggregateHolding[]> {
      return axios
         .get<OwnershipHistoryResponse>(
            `${this.getBaseUrl()}/history?symbol=${symbol}`
         )
         .then((result) => result.data.aggregateHoldings)
   }

   static async getTopShareholders(
      symbol: string
   ): Promise<ShareholderHistory[]> {
      return axios
         .get<TopShareholdersResponse>(
            `${this.getBaseUrl()}/top-shareholders?symbol=${symbol}`
         )
         .then((result) => result.data.securityOwnerships)
   }

   protected static getBaseUrl(): string {
      return super.buildUrl(this.BASE_PATH)
   }
}

export default OwnershipAPI
