import axios from 'axios'
import _ from 'lodash'
import {MidasBackendClient} from "./MidasBackendClient.ts";


export class ScreenerClient extends MidasBackendClient{
   public static screenUsingTradingView() {
      return axios
         .get(`${this.getBaseUrl()}`)
         .then((response: { data: string[] }) => _.uniq(response.data) as string[])
   }
}
