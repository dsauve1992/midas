import { useState } from 'react'
import { useQuery } from 'react-query'
import { UseQueryResult } from 'react-query/types/react/types'
import { ScreenerAPI } from '../../../api/screener/ScreenerAPI'

export type ScreenerType = 'minervini' | 'phoenix'

type useScreenerResult = UseQueryResult<string[]> & {
   screenerType: ScreenerType
   setScreenerType: (type: ScreenerType) => void
}

export const useFinvizScreener = (): useScreenerResult => {
   const [screenerType, setScreenerType] = useState<ScreenerType>('phoenix')

   return {
      ...useQuery<string[]>([`finviz-screener-${screenerType}`], () =>
         ScreenerAPI.screenUsingFinviz(screenerType)
      ),
      screenerType,
      setScreenerType,
   }
}
