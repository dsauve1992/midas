import {useQuery} from 'react-query'
import AskIbdClient, {StockInfo} from '../../../api/AskIbdClient.ts'
import {useApiClientInstance} from "../../../api/useApiClient.ts";

export const useIBDData = (symbol: string) => {
   const instance = useApiClientInstance(AskIbdClient)

   return useQuery<StockInfo>(['asIBD', symbol], () => instance.getDataFor(symbol))
}
