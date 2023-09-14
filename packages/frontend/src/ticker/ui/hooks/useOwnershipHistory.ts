import { useQuery } from 'react-query'
import OwnershipAPI from '../../../api/ownership/OwnershipAPI'
import { AggregateHolding } from '../../../api/ownership/type'

export const useOwnershipHistory = (symbol: string) => {
   return useQuery<AggregateHolding[]>(['ownership-history', symbol], () =>
      OwnershipAPI.getHistory(symbol)
   )
}
