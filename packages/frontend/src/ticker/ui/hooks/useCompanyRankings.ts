import { useQuery } from 'react-query'
import IBDRankingServiceClient from '../../../api/IBDRankingServiceClient/IBDRankingServiceClient'

export const useCompanyRankings = (symbol: string) => {
   return useQuery(['idb-rating', symbol], () =>
      IBDRankingServiceClient.getCompanyRankings(symbol)
   )
}
