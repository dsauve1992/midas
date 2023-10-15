import {useQuery} from 'react-query'
import {UseQueryResult} from 'react-query/types/react/types'
import {ScreenerClient} from '../../../api/ScreenerClient.ts'
import {orderBy} from "lodash";

export const useTradingViewScreener = (): UseQueryResult<string[]> => {
   return {
      ...useQuery<string[]>([`trading-view-screener`], () =>
         ScreenerClient.query()
      ),
   }
}
export const useScreener = (): UseQueryResult<{ symbol:string, fundamentalRating: number }[]> => {
   return {
      ...useQuery<{ symbol:string, fundamentalRating: number }[]>([`screener`], () =>
         ScreenerClient.queryWithRatings(), {
            select: (data) => orderBy(data, "fundamentalRating", "desc")
          }
      ),
   }
}
