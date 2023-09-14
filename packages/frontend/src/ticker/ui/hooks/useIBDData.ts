import { useQuery } from 'react-query'
import AskIbdAPI from '../../../api/askIBD/AskIbdAPI'

interface StockInfo {
   rankInGroup: string
   groupRanking: string
   groupName: string
   groupLeader: string
}

export const useIBDData = (symbol: string) => {
   return useQuery<StockInfo>(['asIBD', symbol], () =>
      AskIbdAPI.getDataFor(symbol)
   )
}
