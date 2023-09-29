import axios from 'axios'

export interface StockInfo {
   rankInGroup: string
   groupRanking: string
   groupName: string
   groupLeader: string
}

class AskIbdAPI {
   static async getDataFor(symbol: string): Promise<StockInfo> {
      return axios
         .get(`${this.getBaseUrl()}?symbol=${symbol}`)
         .then((result) => result.data as StockInfo)
   }

   protected static getBaseUrl(): string {
      return `${import.meta.env.VITE_BACKEND_URL}/investors-business-daily/ranking`
   }
}

export default AskIbdAPI
