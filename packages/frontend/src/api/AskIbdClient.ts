import axios from 'axios'
import {MidasBackendClient} from "./MidasBackendClient.ts";

export interface StockInfo {
   rankInGroup: string
   groupRanking: string
   groupName: string
   groupLeader: string
}


class AskIbdClient extends MidasBackendClient{
   async getDataFor(symbol: string): Promise<StockInfo> {
      return axios
         .get(`${this.getBaseUrl()}?symbol=${symbol}`)
         .then((result) => result.data as StockInfo)
   }

   protected getBaseUrl(): string {
      return `${super.getBaseUrl()}/investors-business-daily/ranking`
   }
}

export default AskIbdClient
