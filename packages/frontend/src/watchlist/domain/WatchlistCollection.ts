import { WatchlistName } from '../ui/component/WatchlistSelector/WatchlistSelector'

export class WatchlistCollection {
   private _tickers: TickerInWatchlist[]

   constructor(tickers: TickerInWatchlist[]) {
      this._tickers = tickers
   }

   get tickers(): TickerInWatchlist[] {
      return this._tickers
   }

   findBySymbol(symbol: string): WatchlistName | null {
      const matchingTicker = this._tickers.find(
         (ticker) => ticker.symbol === symbol
      )

      return matchingTicker ? (matchingTicker.name as WatchlistName) : null
   }
}

export type TickerInWatchlist = {
   symbol: string
   name: string
}
