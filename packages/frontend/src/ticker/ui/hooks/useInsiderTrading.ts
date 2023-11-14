import {useQuery} from 'react-query'
import {StockClient} from "../../../api/StockClient.ts";
import {useAuth0} from "@auth0/auth0-react";

export const useInsiderTrading = (symbol: string) => {
   const {getAccessTokenSilently} = useAuth0()

   return useQuery(
      ['insider-trading', symbol],
      () =>  new StockClient(getAccessTokenSilently).getInsiderTrading(symbol)
   )
}
