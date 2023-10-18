import axios from 'axios'
import _ from 'lodash'
import {MidasBackendClient} from "./MidasBackendClient.ts";


export class ScreenerClient extends MidasBackendClient{
   public static async query() {
      const response = await axios
          .get(`${this.getBaseUrl()}/screener`);
      return _.uniq(response.data) as string[];
   }

   public static async queryWithRatings() {
      const response = await axios
          .get(`${this.getBaseUrl()}/screener/with-rating`);
      return _.uniq(response.data) as { symbol:string, fundamentalRating: number }[];
   }
}