import {useQuery} from 'react-query'
import {MidasBackendClient} from "../../../api/MidasBackendClient.ts";
import {StockGeneralInformationResponseDto} from "../../../../../shared-types/response.dto";

export const useCompanyGeneralInformation = (symbol: string) =>
   useQuery<StockGeneralInformationResponseDto>(
      ['company-general-information', { symbol }],
      () => MidasBackendClient.getCompanyGeneralInformation(symbol),
      { notifyOnChangeProps: 'tracked' }
   )
