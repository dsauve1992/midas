import {useQuery} from 'react-query'
import {StockClient} from "../../../api/StockClient.ts";
import {useAuth0} from "@auth0/auth0-react";

export const useEarningSurprises = (symbol: string) => {
   const {getAccessTokenSilently} = useAuth0()

   return useQuery(['earning-surprises', symbol], () =>
       new StockClient(getAccessTokenSilently).getEarningsSurprises(symbol)
   )
}
