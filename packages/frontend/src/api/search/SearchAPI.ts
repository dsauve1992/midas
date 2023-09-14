import axios from 'axios'
import CloudFunctionApi from '../global/CloudFunctionApi'

export class SearchAPI extends CloudFunctionApi {
   private static readonly BASE_PATH = 'search'

   public static search(query: string) {
      return axios
         .get(`${this.getBaseUrl()}?query=${query}`)
         .then((response) => response.data)
   }

   protected static getBaseUrl(): string {
      return super.buildUrl(this.BASE_PATH)
   }
}
