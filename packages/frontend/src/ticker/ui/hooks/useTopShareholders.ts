import { useQuery } from 'react-query'
import OwnershipAPI from '../../../api/ownership/OwnershipAPI'
import { ShareholderHistory } from '../../../api/ownership/type'

export const useTopShareholders = (symbol: string) => {
   return useQuery<ShareholderHistory[]>(['top-shareholders', symbol], () =>
      OwnershipAPI.getTopShareholders(symbol)
   )
}
