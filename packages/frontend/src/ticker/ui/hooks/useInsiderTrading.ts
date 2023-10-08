import {useQuery} from 'react-query'
import {MidasBackendClient} from "../../../api/MidasBackendClient.ts";

export const useInsiderTrading = (symbol: string) => {
   return useQuery(
      ['insider-trading', symbol],
      () => MidasBackendClient.getInsiderTrading(symbol)
   )
}
