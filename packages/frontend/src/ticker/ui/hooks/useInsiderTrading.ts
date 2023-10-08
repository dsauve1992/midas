import {useQuery} from 'react-query'
import {StockClient} from "../../../api/StockClient.ts";

export const useInsiderTrading = (symbol: string) => {
   return useQuery(
      ['insider-trading', symbol],
      () => StockClient.getInsiderTrading(symbol)
   )
}
