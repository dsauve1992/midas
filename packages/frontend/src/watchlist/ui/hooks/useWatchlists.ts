import { useMutation, useQuery, useQueryClient } from 'react-query'
import WatchlistAPI from '../../../api/watchlist/WatchlistAPI'
import { WatchlistCollection } from '../../domain/WatchlistCollection'
import { WatchlistName } from '../component/WatchlistSelector/WatchlistSelector'

export const useWatchlists = () => {
   const queryClient = useQueryClient()

   const { data, isLoading } = useQuery<WatchlistCollection>(
      ['watchlist'],
      () => WatchlistAPI.getWatchlists()
   )

   const setTickerWithCategory = useMutation<
      void,
      unknown,
      { symbol: string; category: WatchlistName }
   >(({ symbol, category }) => WatchlistAPI.setCategory(symbol, category), {
      onSuccess: () => queryClient.invalidateQueries(['watchlist']),
   })

   return {
      data,
      isLoading,
      update: setTickerWithCategory.mutate,
   }
}
