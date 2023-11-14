import {useQuery} from 'react-query'
import {StockClient} from "../../../api/StockClient.ts";
import {InstitutionalOwnershipResponse} from "backend/src/shared-types/institutional-ownership";
import {useAuth0} from "@auth0/auth0-react";

export const useInstitutionalOwnership = (symbol: string) => {
   const {getAccessTokenSilently} = useAuth0()

   return useQuery<InstitutionalOwnershipResponse>(['institutional-ownership', symbol], () =>
       new StockClient(getAccessTokenSilently).getInstitutionalOwnership(symbol)
   )
}
