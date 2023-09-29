import { useQuery } from 'react-query'
import AskIbdAPI, {StockInfo} from '../../../api/askIBD/AskIbdAPI'

export const useIBDData = (symbol: string) => {
   return useQuery<StockInfo>(['asIBD', symbol], () =>
      AskIbdAPI.getDataFor(symbol)
   )
}
