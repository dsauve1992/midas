import axios from 'axios'
import {MidasBackendClient} from "./MidasBackendClient.ts";

export interface StockInfo {
   rankInGroup: string
   groupRanking: string
   groupName: string
   groupLeader: string
}


class AskIbdAPI extends MidasBackendClient{
   static async getDataFor(symbol: string): Promise<StockInfo> {
      return axios
         .get(`${this.getBaseUrl()}?symbol=${symbol}`)
         .then((result) => result.data as StockInfo)
   }

   protected static getBaseUrl(): string {
      return `${super.getBaseUrl()}/investors-business-daily/ranking`
   }
}

export default AskIbdAPI
