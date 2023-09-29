import axios from 'axios'
import _ from 'lodash'


export class ScreenerAPI {
   public static screenUsingTradingView() {
      return axios
         .get(`${this.getBaseUrl()}`)
         .then((response: { data: string[] }) => _.uniq(response.data) as string[])
   }

   protected static getBaseUrl(): string {
      return `${import.meta.env.VITE_BACKEND_URL}/screener`
   }
}
