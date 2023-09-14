import axios from 'axios'
import CloudFunctionApi from '../global/CloudFunctionApi'

class AskIbdAPI extends CloudFunctionApi {
   private static readonly BASE_PATH = 'askIBD'

   static async getDataFor(symbol: string): Promise<any> {
      return axios
         .get(`${this.getBaseUrl()}?symbol=${symbol}`)
         .then((result) => result.data)
   }

   protected static getBaseUrl(): string {
      return super.buildUrl(this.BASE_PATH)
   }
}

export default AskIbdAPI
