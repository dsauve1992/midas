import {useQuery} from 'react-query'
import {StockClient} from "../../../api/StockClient.ts";
import {StockGeneralInformationResponseDto} from "backend/src/shared-types/response.dto";
import {useAuth0} from "@auth0/auth0-react";

export const useCompanyGeneralInformation = (symbol: string) => {
   const {getAccessTokenSilently} = useAuth0()

   return useQuery<StockGeneralInformationResponseDto>(
      ['company-general-information', { symbol }],
      () => new StockClient(getAccessTokenSilently).getCompanyGeneralInformation(symbol),
      { notifyOnChangeProps: 'tracked' }
   )
}
