import axios from 'axios'
import CloudFunctionApi from '../global/CloudFunctionApi'

class MarketCycleClient extends CloudFunctionApi {
   private static readonly BASE_PATH = 'breadth-current'

   static async getDataFor(symbols: string[]): Promise<never> {
      return axios
         .post(`${this.getBaseUrl()}`, { symbols })
         .then((result) => result.data as never)
   }

   protected static getBaseUrl(): string {
      return super.buildUrl(this.BASE_PATH)
   }
}

export default MarketCycleClient
