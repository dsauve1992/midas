import {useQuery} from 'react-query'
import {StockClient} from "../../../api/StockClient.ts";
import {StockGeneralInformationResponseDto} from "../../../../../backend/src/shared-types/response.dto";

export const useCompanyGeneralInformation = (symbol: string) =>
   useQuery<StockGeneralInformationResponseDto>(
      ['company-general-information', { symbol }],
      () => StockClient.getCompanyGeneralInformation(symbol),
      { notifyOnChangeProps: 'tracked' }
   )
