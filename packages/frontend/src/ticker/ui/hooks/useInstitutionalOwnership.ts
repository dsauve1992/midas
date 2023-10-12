import {useQuery} from 'react-query'
import {StockClient} from "../../../api/StockClient.ts";
import {InstitutionalOwnershipResponse} from "../../../../../backend/src/shared-types/institutional-ownership";

export const useInstitutionalOwnership = (symbol: string) => {
   return useQuery<InstitutionalOwnershipResponse>(['institutional-ownership', symbol], () =>
      StockClient.getInstitutionalOwnership(symbol)
   )
}
