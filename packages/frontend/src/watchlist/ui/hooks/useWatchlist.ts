import { useQuery } from 'react-query'
import WatchlistAPI from '../../../api/watchlist/WatchlistAPI'
import { WatchlistName } from '../component/WatchlistSelector/WatchlistSelector'

export const useWatchlist = (name: WatchlistName) => {
   return useQuery<string[]>(['watchlist', name], () =>
      WatchlistAPI.getWatchlist(name)
   )
}

