import { useQuery } from 'react-query'
import { UseQueryResult } from 'react-query/types/react/types'
import { ScreenerAPI } from '../../../api/screener/ScreenerAPI'

export const useTradingViewScreener = (): UseQueryResult<string[]> => {
   return {
      ...useQuery<string[]>([`trading-view-screener`], () =>
         ScreenerAPI.screenUsingTradingView()
      ),
   }
}
