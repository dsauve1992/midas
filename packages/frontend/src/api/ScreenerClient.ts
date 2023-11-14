import axios from 'axios'
import _ from 'lodash'
import {MidasBackendClient} from "./MidasBackendClient.ts";


export class ScreenerClient extends MidasBackendClient{
   public async query() {
      const response = await axios
          .get(`${this.getBaseUrl()}/screener`);
      return _.uniq(response.data) as string[];
   }

   public async queryWithRatings() {
      type SymbolsWithRating = { symbol:string, fundamentalRating: number,technicalRating: number }[]

      const response = await this
          .get<SymbolsWithRating>(`${this.getBaseUrl()}/screener/with-rating`);
      return _.uniq(response.data);
   }
}
