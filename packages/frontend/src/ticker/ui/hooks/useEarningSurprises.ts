import {useQuery} from 'react-query'
import {MidasBackendClient} from "../../../api/MidasBackendClient.ts";

export const useEarningSurprises = (symbol: string) => {
   return useQuery(['earning-surprises', symbol], () =>
      MidasBackendClient.getEarningsSurprises(symbol)
   )
}
