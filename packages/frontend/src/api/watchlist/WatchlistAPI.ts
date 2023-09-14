import axios from 'axios'
import {
   TickerInWatchlist,
   WatchlistCollection,
} from '../../watchlist/domain/WatchlistCollection'
import CloudFunctionApi from '../global/CloudFunctionApi'
import { WatchlistName } from '../../watchlist/ui/component/WatchlistSelector/WatchlistSelector'

class WatchlistAPI extends CloudFunctionApi {
   private static readonly BASE_PATH = 'watchlists'

   static async getWatchlists(): Promise<WatchlistCollection> {
      return axios
         .get<any[]>(`${this.getBaseUrl()}`)
         .then((result) => result.data)
         .then((data) => {
            const tickerInWatchlist: TickerInWatchlist[] = []

            for (const list of data) {
               for (const symbol of list.symbols) {
                  tickerInWatchlist.push({ symbol, name: list.name })
               }
            }

            return new WatchlistCollection(tickerInWatchlist)
         })
   }

   static async getWatchlist(name: WatchlistName): Promise<string[]> {
      return axios
         .get<string[]>(`${this.getBaseUrl()}/${name}`)
         .then((result) => result.data)
   }

   static async setCategory(symbol: string, category: string): Promise<void> {
      return axios.post(`${this.getBaseUrl()}/${symbol}`, {
         category,
      })
   }

   protected static getBaseUrl(): string {
      return super.buildUrl(this.BASE_PATH)
   }
}

export default WatchlistAPI
