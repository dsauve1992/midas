import {useQuery} from 'react-query'
import {StockClient} from "../../../api/StockClient.ts";

export const useEarningSurprises = (symbol: string) => {
   return useQuery(['earning-surprises', symbol], () =>
      StockClient.getEarningsSurprises(symbol)
   )
}
