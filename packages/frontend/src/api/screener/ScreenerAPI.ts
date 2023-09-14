import axios from 'axios'
import _ from 'lodash'
import CloudFunctionApi from '../global/CloudFunctionApi'

export class ScreenerAPI extends CloudFunctionApi {
   private static readonly BASE_PATH = 'screener'

   public static screenUsingFinviz(name: string) {
      return axios
         .get(`${this.getBaseUrl()}/finviz?screener=${name}`)
         .then((response: { data: any }) => response.data)
   }

   public static screenUsingTradingView() {
      return axios
         .get(`${this.getBaseUrl()}/trading-view`)
         .then((response: { data: any }) => _.uniq(response.data) as string[])
   }

   protected static getBaseUrl(): string {
      return super.buildUrl(this.BASE_PATH)
   }
}
