import {useQuery} from 'react-query'
import {UseQueryResult} from 'react-query/types/react/types'
import {ScreenerClient} from '../../../api/ScreenerClient.ts'

export const useTradingViewScreener = (): UseQueryResult<string[]> => {
   return {
      ...useQuery<string[]>([`trading-view-screener`], () =>
         ScreenerClient.screenUsingTradingView()
      ),
   }
}
