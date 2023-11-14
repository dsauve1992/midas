import {useQuery} from 'react-query'
import AskIbdAPI, {StockInfo} from '../../../api/AskIbdAPI.ts'
import {useAuth0} from "@auth0/auth0-react";

export const useIBDData = (symbol: string) => {
   const {getAccessTokenSilently} = useAuth0()

   return useQuery<StockInfo>(['asIBD', symbol], () =>
      new AskIbdAPI(getAccessTokenSilently).getDataFor(symbol)
   )
}
