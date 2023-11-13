import {useQuery} from 'react-query'
import AskIbdAPI, {StockInfo} from '../../../api/AskIbdAPI.ts'

export const useIBDData = (symbol: string) => {
   return useQuery<StockInfo>(['asIBD', symbol], () =>
      new AskIbdAPI().getDataFor(symbol)
   )
}
