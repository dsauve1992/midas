import {useQuery} from 'react-query'
import {UseQueryResult} from 'react-query/types/react/types'
import {ScreenerClient} from '../../../api/ScreenerClient.ts'
import {orderBy} from "lodash";

export const useTradingViewScreener = (): UseQueryResult<string[]> => {
   return {
      ...useQuery<string[]>([`trading-view-screener`], () =>
         new ScreenerClient().query()
      ),
   }
}
export const useScreener = (): UseQueryResult<{ symbol:string, fundamentalRating: number, technicalRating: number }[]> => {
   return {
      ...useQuery<{ symbol:string, fundamentalRating: number,technicalRating: number }[]>([`screener`], () =>
         new ScreenerClient().queryWithRatings(), {
            select: (data) => orderBy(data, ({technicalRating, fundamentalRating}) => technicalRating * fundamentalRating, "desc")
          }
      ),
   }
}
