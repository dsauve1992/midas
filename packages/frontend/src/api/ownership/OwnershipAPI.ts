import axios from 'axios'
import {
   OwnershipHistoryResponse,
   AggregateHolding,
   ShareholderHistory,
   TopShareholdersResponse,
} from './type'

class OwnershipAPI {
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
      return `${import.meta.env.VITE_BACKEND_URL}/ownership`
   }
}

export default OwnershipAPI
